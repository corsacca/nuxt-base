# Nuxt Base Layer Documentation

This document describes the Nuxt Base Layer that this project extends. Use this reference to understand what functionality is already provided and how to integrate with it.

---

## Quick Start

### 1. Configure Your Project

Edit `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: ['../base'],  // Adjust path to layer location

  // Override SSR if needed (layer defaults to false)
  ssr: true,

  // Deployment configuration
  nitro: {
    preset: 'vercel'
  },

  // Runtime configuration
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpSecure: process.env.SMTP_SECURE,
    smtpFrom: process.env.SMTP_FROM,
    smtpRejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED,
    s3Endpoint: process.env.S3_ENDPOINT,
    s3Region: process.env.S3_REGION,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    s3BucketName: process.env.S3_BUCKET_NAME,
    public: {
      nodeEnv: process.env.NODE_ENV || 'development',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
})
```

### 2. Set Up Environment Variables

Copy the layer's `.env.example` to your project and fill in values:

```bash
cp ../base/.env.example .env
```

### 3. Configure Migrations

Update `package.json`:

```json
{
  "scripts": {
    "migrate": "node ../base/scripts/migrate.mjs",
    "dev": "npm run migrate && nuxt dev",
    "build": "npm run migrate && nuxt build"
  }
}
```

### 4. Install and Run

```bash
npm install
npm run dev
```

Your app now has authentication, theme system, email, and all server utilities.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Layer not found | Check path in `extends` array |
| Env vars not working | Ensure `.env` is in your project root |
| Components not importing | Restart dev server |
| TypeScript errors | Run `npm run postinstall` |

---

## Overview

The base layer provides:
- **Authentication** - JWT-based auth with email verification, password reset, and profile management
- **Theme System** - Light/dark mode with persistence
- **Email System** - SMTP-based templated emails
- **S3 Storage** - File uploads with presigned URLs
- **Database Utilities** - PostgreSQL connection and query helpers
- **Activity Logging** - Audit trail for user actions

---

## Composables

### `useAuth()`

Authentication state and methods.

```typescript
const { user, isLoggedIn, authReady, login, logout, register, checkAuth } = useAuth()
```

**Reactive Properties:**
- `user` - Current user object (readonly ref)
- `isLoggedIn` - Boolean computed for login state
- `authReady` - Boolean ref for auth initialization status

**Methods:**
- `login(email, password)` - Returns `{ success, message? }`
- `logout()` - Clears auth and redirects to login
- `register(email, password, display_name)` - Returns `{ success, message?, requiresVerification? }`
- `checkAuth()` - Verifies auth status with server
- `restoreFromCache()` - Restores user from sessionStorage
- `setAuthReady(value)` - Sets auth ready state

**User Object Shape:**
```typescript
{
  id: string
  email: string
  display_name: string
  avatar: string | null
  verified: boolean
  superadmin: boolean
  created: string
  updated: string
}
```

### `useTheme()`

Theme management wrapping Nuxt UI's color mode.

```typescript
const { theme, toggleTheme, initTheme } = useTheme()
```

- `theme` - Computed ref: `'light'` or `'dark'`
- `toggleTheme()` - Toggles between modes
- `initTheme()` - No-op (Nuxt UI handles initialization)

---

## Components

### `<ThemeToggle />`

Button component for toggling light/dark mode. No props required.

```vue
<ThemeToggle />
```

---

## Middleware

### `auth`

Route protection middleware. Redirects unauthenticated users to `/login` with a `redirect` query parameter.

**Usage in pages:**
```typescript
definePageMeta({
  middleware: 'auth'
})
```

---

## Layouts

### `default`

Main layout for authenticated pages.

**Features:**
- Sticky header with app name
- User display name in header
- Profile button and theme toggle
- Named slots: `header-left`, `header-right`

### `auth`

Centered layout for authentication pages (login, register, reset-password).

---

## Pages Provided

The base layer includes these pages that can be overridden:

| Path | Layout | Auth Required | Purpose |
|------|--------|---------------|---------|
| `/` | default | No | Landing page with login/register links |
| `/login` | auth | No | Login form with forgot password |
| `/register` | auth | No | Registration with email verification |
| `/reset-password` | auth | No | Password reset (requires token) |
| `/dashboard` | default | Yes | Protected dashboard template |
| `/profile` | default | Yes | Profile management |
| `/kitchen` | default | Yes | UI component showcase |

---

## Server API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/logout` | Clear auth session |
| GET | `/api/auth/me` | Get current user data |
| GET | `/api/auth/verify` | Verify email (token param) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Complete password reset |
| GET | `/api/auth/verify-email-change` | Verify email change |

### Profile

| Method | Endpoint | Purpose |
|--------|----------|---------|
| PATCH | `/api/profile/name` | Update display name |
| POST | `/api/profile/email` | Request email change |
| PATCH | `/api/profile/password` | Change password |

---

## Server Utilities

### Database (`server/utils/database.ts`)

```typescript
import { sql, tableExists } from '../utils/database'

// Tagged template queries
const users = await sql`SELECT * FROM users WHERE id = ${userId}`

// Check table existence
const exists = await tableExists('my_table')
```

### Email (`server/utils/email.ts`)

```typescript
import { sendEmail, sendTemplateEmail, sendBulkTemplateEmails } from '../utils/email'

// Raw email
await sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>Content</p>'
})

// Templated email
await sendTemplateEmail({
  to: 'user@example.com',
  template: 'notification',
  data: { userName: 'John', message: 'Your order shipped' }
})
```

**Available Templates:**
- `test` - Test email
- `welcome` - New user welcome
- `notification` - Generic notification
- `bulk` - Admin bulk message
- `verification` - Email verification
- `emailChangeVerification` - Email change confirmation
- `passwordReset` - Password reset
- `commentNotification` - Comment alert
- `subscriberCommentNotification` - Subscriber comment alert
- `entryClaimedNotification` - Item claimed alert
- `dailySummary` - Admin daily summary

### Storage (`server/utils/storage.ts`)

```typescript
import { uploadToS3, deleteFromS3, generateSignedUrl, validateImageType, validateFileSize } from '../utils/storage'

// Upload file
const result = await uploadToS3(buffer, 'image.jpg', 'image/jpeg')
// Returns: { success, key, url }

// Generate signed URL (7-day expiry)
const url = await generateSignedUrl(key)

// Delete file
await deleteFromS3(key)

// Validation
validateImageType('image/jpeg') // true
validateFileSize(1024 * 1024, 5) // true if under 5MB
```

**Supported image types:** JPEG, PNG, GIF, WebP, HEIC, HEIF

### Auth Utilities (`server/utils/auth.ts`)

```typescript
import { requireAuth, getAuthUser, verifyToken } from '../utils/auth'

// In API handlers - require authentication
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event) // Throws 401 if not authenticated
  // user contains: { userId, email, display_name }
})

// Optional authentication
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event) // Returns null if not authenticated
})
```

### Activity Logger (`server/utils/activity-logger.ts`)

```typescript
import { logEvent, logCreate, logUpdate, logDelete } from '../utils/activity-logger'

// Generic event
await logEvent({
  eventType: 'CUSTOM_ACTION',
  tableName: 'orders',
  recordId: orderId,
  userId: user.userId,
  metadata: { details: 'value' }
})

// Convenience methods (accept userId string or H3Event)
await logCreate('orders', orderId, event, { total: 99.99 })
await logUpdate('orders', orderId, event)
await logDelete('orders', orderId, event)
```

---

## Database Schema

The base layer expects these tables:

### `users`
```sql
id              UUID PRIMARY KEY
created         TIMESTAMP
updated         TIMESTAMP
email           VARCHAR UNIQUE
password        VARCHAR (bcrypt hash)
verified        BOOLEAN
superadmin      BOOLEAN
display_name    VARCHAR
avatar          VARCHAR NULL
token_key       UUID (email verification)
email_visibility BOOLEAN
pending_email   VARCHAR NULL
email_change_token UUID NULL
```

### `password_reset_requests`
```sql
user_id         UUID FOREIGN KEY
token           UUID UNIQUE
expires         TIMESTAMP
used            BOOLEAN
```

### `activity_logs`
```sql
id              UUID PRIMARY KEY
timestamp       BIGINT
event_type      VARCHAR
table_name      VARCHAR NULL
record_id       VARCHAR NULL
user_id         UUID NULL
user_agent      VARCHAR NULL
metadata        JSONB
```

---

## Environment Variables

The base layer requires these environment variables:

### Required
```env
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/db
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Email (SMTP)
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password
SMTP_SECURE=true
SMTP_FROM=noreply@example.com
SMTP_FROM_NAME=App Name
SMTP_REJECT_UNAUTHORIZED=true
```

### S3 Storage (Optional)
```env
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_REGION=us-west-004
S3_ACCESS_KEY_ID=your-key-id
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket
```

### Application
```env
APP_TITLE=Your App Name
NODE_ENV=production
```

---

## Extending the Base Layer

### Overriding Pages

Create a page with the same path to override:

```
app/pages/dashboard.vue  # Overrides base layer dashboard
```

### Overriding Layouts

Create a layout with the same name:

```
app/layouts/default.vue  # Overrides base layer default layout
```

### Adding Protected Pages

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Using Base Layer Utilities in API Routes

```typescript
// server/api/my-endpoint.post.ts
import { requireAuth } from '../utils/auth'
import { sql } from '../utils/database'
import { logCreate } from '../utils/activity-logger'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const [record] = await sql`
    INSERT INTO my_table (user_id, data)
    VALUES (${user.userId}, ${body.data})
    RETURNING *
  `

  await logCreate('my_table', record.id, event)

  return { success: true, record }
})
```

---

## Migration System

The base layer uses build-time migrations that run during `npm run build` and `npm run dev`. This is more reliable for serverless environments like Vercel.

### How It Works

1. Migrations run automatically before build/dev
2. Base layer migrations run first, then project migrations
3. Each migration is tracked in a `migrations` table with a `source` column (`base` or `project`)
4. Migration IDs are scoped per source, so both base and project can have migration `001`

### Setup for Consuming Projects

**Update package.json scripts:**

```json
{
  "scripts": {
    "migrate": "node ../base/scripts/migrate.mjs",
    "dev": "npm run migrate && nuxt dev",
    "build": "npm run migrate && nuxt build"
  }
}
```

If using the layer via npm:
```json
{
  "scripts": {
    "migrate": "node node_modules/@yourorg/nuxt-base-layer/scripts/migrate.mjs"
  }
}
```

### Creating Project Migrations

Create a `migrations/` folder in your project root:

```
your-project/
├── migrations/
│   ├── 001_create_products.js
│   └── 002_add_inventory.js
├── nuxt.config.ts
└── package.json
```

### Migration File Format

Files must follow the pattern: `{number}_{description}.js`

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

  async columnExists(sql, tableName, columnName) {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
        AND column_name = ${columnName}
      ) as exists
    `
    return result[0]?.exists || false
  }
}

export default class CreateProducts extends BaseMigration {
  id = 1  // Must match the number in filename
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

### Base Layer Migrations

The base layer includes these migrations:

| ID | Name | Creates |
|----|------|---------|
| 001 | Create initial tables | `users`, `activity_logs` tables with indexes |
| 002 | Add email change fields | `pending_email`, `email_change_token` columns on users |
| 003 | Create password reset table | `password_reset_requests` table |

### Running Migrations

```bash
# Run migrations only
npm run migrate

# Skip migrations (run Nuxt directly)
npx nuxt dev
npx nuxt build
```

### Vercel Deployment

No additional configuration needed. Vercel runs `npm run build`, which includes migrations. Ensure `DATABASE_URL` is set in your Vercel project's environment variables.

---

## What the Base Layer Does NOT Provide

- Role-based permissions (only `superadmin` boolean)
- OAuth/social login
- Two-factor authentication
- Rate limiting
- CSRF protection (relies on SameSite cookies)
- API documentation/OpenAPI
- WebSocket support
- Background job processing
- Caching layer

---

## Configuration Reference

The base layer uses these nuxt.config settings:

```typescript
{
  ssr: false,  // SPA mode by default
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/default.css'],
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15'
}
```

Consuming projects can override any of these settings.
