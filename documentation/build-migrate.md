# Build-Time Migrations

This base layer runs database migrations at build time rather than runtime. This is more reliable for serverless environments like Vercel where dynamic file imports and cold starts can cause issues.

## How It Works

- Migrations run automatically during `npm run build` and `npm run dev`
- The script loads `.env` automatically
- Base layer migrations run first, then project migrations
- Each migration is tracked in a `migrations` table with a `source` column (`base` or `project`)

## Setup for Consuming Projects

### 1. Update package.json Scripts

Add or update these scripts to run migrations before build/dev:

```json
{
  "scripts": {
    "migrate": "node node_modules/@corsacca/nuxt-base-layer/scripts/migrate.mjs",
    "dev": "npm run migrate && nuxt dev",
    "build": "npm run migrate && nuxt build"
  }
}
```

If using the layer via local path (e.g., `extends: ['../base']`):

```json
{
  "scripts": {
    "migrate": "node ../base/scripts/migrate.mjs",
    "dev": "npm run migrate && nuxt dev",
    "build": "npm run migrate && nuxt build"
  }
}
```

### 2. Environment Variables

Ensure `DATABASE_URL` is set in your `.env` file or environment:

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

For Vercel, add `DATABASE_URL` to your project's environment variables in the dashboard.

### 3. Project Migrations

Create project-specific migrations in a `migrations/` folder at your project root:

```
your-project/
├── migrations/
│   ├── 001_create_products.js
│   └── 002_add_inventory.js
├── nuxt.config.ts
└── package.json
```

### Migration File Format

Each migration file should export a default class:

```javascript
class BaseMigration {
  async exec(sql, query) {
    await sql.unsafe(query)
  }

  async tableExists(sql, tableName) {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
      ) as exists
    `
    return result[0]?.exists || false
  }
}

export default class CreateProducts extends BaseMigration {
  id = 1
  name = 'Create products table'

  async up(sql) {
    const exists = await this.tableExists(sql, 'products')
    if (!exists) {
      await this.exec(sql, `
        CREATE TABLE products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `)
    }
  }
}
```

### Migration Naming Convention

Files must follow the pattern: `{number}_{description}.js`

- `001_create_users.js`
- `002_add_email_field.js`
- `003_create_orders.js`

The number in the filename must match the `id` property in the class.

## Vercel Deployment

No additional configuration needed. Vercel automatically runs `npm run build`, which now includes migrations. Just ensure `DATABASE_URL` is set in your Vercel project's environment variables.

## Running Migrations Manually

To run migrations without building:

```bash
npm run migrate
```

## Skipping Migrations

For local development without a database, run Nuxt directly:

```bash
npx nuxt dev
npx nuxt build
```
