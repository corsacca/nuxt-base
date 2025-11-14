import type { Sql } from 'postgres'
import { readdir } from 'fs/promises'
import { join } from 'path'
import type { Migration } from './migration-interface'

type MigrationSource = 'base' | 'project'

interface NamespacedMigration extends Migration {
  source: MigrationSource
}

export class MigrationRunner {
  private sql: Sql

  constructor(database: Sql) {
    this.sql = database
  }

  private async initializeMigrationsTable() {
    // Create migrations table if it doesn't exist
    await this.sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        migration_id INTEGER NOT NULL,
        source TEXT NOT NULL,
        name TEXT NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(source, migration_id)
      )
    `
  }

  private async loadMigrationsFromDir(dir: string, source: MigrationSource): Promise<NamespacedMigration[]> {
    try {
      const files = await readdir(dir)
      const migrationFiles = files
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
        .sort() // Sort alphabetically to ensure order

      const migrations: NamespacedMigration[] = []

      for (const file of migrationFiles) {
        // Extract migration number from filename (e.g., "001_initial.ts" -> 1)
        const match = file.match(/^(\d+)_(.+)\.(ts|js)$/)
        if (!match) {
          console.warn(`Skipping invalid migration file: ${file}`)
          continue
        }

        const id = parseInt(match[1]!, 10)
        const filePath = join(dir, file)

        try {
          // Dynamically import the migration module
          // Use absolute file URL for proper module resolution
          const absolutePath = filePath.replace(/\\/g, '/')
          const fileUrl = `file://${absolutePath}`
          const migrationModule = await import(fileUrl)
          const MigrationClass = migrationModule.default

          if (!MigrationClass) {
            console.warn(`Migration file ${file} does not export a default class`)
            continue
          }

          const migrationInstance = new MigrationClass() as Migration

          if (migrationInstance.id !== id) {
            console.warn(`Migration file ${file} has mismatched ID: expected ${id}, got ${migrationInstance.id}`)
            continue
          }

          // Add source property to the migration instance
          const namespacedMigration = migrationInstance as NamespacedMigration
          namespacedMigration.source = source
          migrations.push(namespacedMigration)
        }
        catch (error) {
          console.error(`Failed to load migration ${file}:`, error)
          continue
        }
      }

      return migrations.sort((a, b) => a.id - b.id)
    }
    catch {
      console.log(`📝 No ${source} migrations directory found`)
      return []
    }
  }

  private async loadMigrations(): Promise<NamespacedMigration[]> {
    // Load base layer migrations
    // Strategy: Find the base layer by looking for common layer locations
    const cwdDir = process.cwd()
    const possibleBaseDirs = [
      // Local base layer (when testing with extends: ['../../base'])
      join(cwdDir, '../../base/migrations'),
      join(cwdDir, '../base/migrations'),
      // Remote GitHub layer cached by c12
      join(cwdDir, 'node_modules/.c12'),
    ]

    let baseLayerDir: string | null = null
    let baseMigrations: NamespacedMigration[] = []

    // Try local base layer first
    for (const possibleDir of possibleBaseDirs.slice(0, 2)) {
      console.log('🔍 Checking for base migrations in:', possibleDir)
      const migrations = await this.loadMigrationsFromDir(possibleDir, 'base')
      if (migrations.length > 0) {
        baseLayerDir = possibleDir
        baseMigrations = migrations
        console.log(`✅ Loaded ${baseMigrations.length} base migration(s) from ${baseLayerDir}`)
        break
      }
    }

    // If not found in local, try c12 cache
    if (baseMigrations.length === 0) {
      const c12Dir = possibleBaseDirs[2]
      try {
        const c12Entries = await readdir(c12Dir)
        for (const entry of c12Entries) {
          if (entry.startsWith('github_corsacca_nuxt')) {
            const layerMigrationsDir = join(c12Dir, entry, 'migrations')
            console.log('🔍 Checking for base migrations in c12 cache:', layerMigrationsDir)
            const migrations = await this.loadMigrationsFromDir(layerMigrationsDir, 'base')
            if (migrations.length > 0) {
              baseLayerDir = layerMigrationsDir
              baseMigrations = migrations
              console.log(`✅ Loaded ${baseMigrations.length} base migration(s) from ${baseLayerDir}`)
              break
            }
          }
        }
      } catch {
        console.log('📝 No c12 cache found')
      }
    }

    if (baseMigrations.length === 0) {
      console.log('⚠️  No base layer migrations found')
    }

    // Load project migrations (from the consuming project's migrations directory)
    const projectDir = join(cwdDir, 'migrations')
    console.log('🔍 Looking for project migrations in:', projectDir)
    const projectMigrations = await this.loadMigrationsFromDir(projectDir, 'project')
    console.log(`✅ Loaded ${projectMigrations.length} project migration(s)`)

    // Combine: base migrations first (sorted by ID), then project migrations (sorted by ID)
    // This ensures base:001, base:002, base:003, project:001, project:002
    return [...baseMigrations, ...projectMigrations]
  }

  private async getExecutedMigrations(): Promise<Set<string>> {
    const rows = await this.sql`SELECT source, migration_id FROM migrations ORDER BY id`
    // Return set of "source:id" strings (e.g., "base:1", "project:2")
    return new Set(rows.map(row => `${row.source}:${row.migration_id}`))
  }

  private async executeMigration(migration: NamespacedMigration) {
    console.log(`Executing ${migration.source} migration ${migration.id}: ${migration.name}`)

    await this.sql.begin(async (sql) => {
      // Create a hybrid adapter that supports both postgres API (tagged templates)
      // and traditional pool.query() API for backwards compatibility
      const adapter = Object.assign(
        // Create a function that acts as the tagged template handler
        function(...args: any[]) {
          return (sql as any)(...args)
        },
        // Add all postgres sql methods/properties
        sql,
        // Add pool.query() method for legacy migrations
        {
          query: async (queryString: string, params?: any[]) => {
            if (params && params.length > 0) {
              let paramIndex = 1
              const convertedQuery = queryString.replace(/\?/g, () => `$${paramIndex++}`)
              return { rows: await sql.unsafe(convertedQuery, params) }
            }
            return { rows: await sql.unsafe(queryString) }
          }
        }
      )

      // Execute the migration's up method
      await migration.up(adapter as any)

      // Record that this migration was executed
      await sql`
        INSERT INTO migrations (migration_id, source, name)
        VALUES (${migration.id}, ${migration.source}, ${migration.name})
      `
    })

    console.log(`✓ ${migration.source} migration ${migration.id} completed successfully`)
  }

  async runMigrations(): Promise<void> {
    console.log('🔄 Checking for pending migrations...')

    await this.initializeMigrationsTable()

    const allMigrations = await this.loadMigrations()
    if (allMigrations.length === 0) {
      console.log('📝 No migrations found')
      return
    }

    const executedMigrationKeys = await this.getExecutedMigrations()
    const pendingMigrations = allMigrations.filter(
      migration => !executedMigrationKeys.has(`${migration.source}:${migration.id}`)
    )

    if (pendingMigrations.length === 0) {
      console.log('✅ All migrations are up to date')
      return
    }

    console.log(`📋 Found ${pendingMigrations.length} pending migration(s)`)

    for (const migration of pendingMigrations) {
      try {
        await this.executeMigration(migration)
      }
      catch (error) {
        console.error(`❌ ${migration.source} migration ${migration.id} failed:`, error)
        throw new Error(`${migration.source} migration ${migration.id} failed: ${error}`)
      }
    }

    console.log('🎉 All migrations completed successfully')
  }

  async getMigrationStatus(): Promise<{ executed: string[], pending: string[], total: number }> {
    await this.initializeMigrationsTable()
    const allMigrations = await this.loadMigrations()
    const executedMigrationKeys = await this.getExecutedMigrations()
    const executed = Array.from(executedMigrationKeys)
    const pending = allMigrations
      .filter(m => !executedMigrationKeys.has(`${m.source}:${m.id}`))
      .map(m => `${m.source}:${m.id}`)

    return {
      executed,
      pending,
      total: allMigrations.length,
    }
  }
}
