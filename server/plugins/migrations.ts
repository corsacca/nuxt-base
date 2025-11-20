import postgres from 'postgres'
import { MigrationRunner } from '../utils/migrations'

export default defineNitroPlugin(async (nitroApp) => {
  // Skip migrations in test environments or if explicitly disabled
  if (process.env.SKIP_MIGRATIONS === 'true') {
    console.log('⏭️  Skipping migrations (SKIP_MIGRATIONS=true)')
    return
  }

  // Get database URL from runtime config or environment variable
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.warn('⚠️  DATABASE_URL not set, skipping migrations')
    return
  }

  console.log('🚀 Running migrations on server startup...')

  // Detect if this is a localhost connection (no SSL required)
  const isLocalhost = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')

  // Create a temporary connection just for migrations
  const migrationConnection = postgres(databaseUrl, {
    ssl: isLocalhost ? false : 'require',
    max: 1, // Only need 1 connection for migrations
    idle_timeout: 20,
    connect_timeout: 30,
    onnotice: () => {}, // Suppress NOTICE messages
  })

  try {
    const migrationRunner = new MigrationRunner(migrationConnection)
    await migrationRunner.runMigrations()
    console.log('✅ Server startup migrations completed')
  } catch (error) {
    console.error('❌ Migration failed during server startup:', error)
    // Close the connection before throwing
    await migrationConnection.end()
    throw error // This will prevent the server from starting if migrations fail
  }

  // Close the migration connection
  await migrationConnection.end()
})
