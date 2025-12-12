# Nuxt Base Layer

A Nuxt 4.1.0 base layer providing authentication, theme management, email, storage, and database utilities.

## Features

- **Authentication** - JWT-based auth with email verification and password reset
- **Theme System** - Light/dark mode with persistence
- **Email** - SMTP templated emails
- **S3 Storage** - File uploads with presigned URLs
- **Database** - PostgreSQL utilities
- **@nuxt/ui** - Pre-configured UI components

## Quick Start

### 1. Create a New Nuxt Project

```bash
npx nuxi@latest init my-app
cd my-app
```

### 2. Extend This Layer

Update `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: ['github:corsacca/nuxt-base#master'],  // Or use a tag like #v1.2.0

  runtimeConfig: {
    appName: process.env.APP_TITLE,
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
      appName: process.env.APP_TITLE,
      nodeEnv: process.env.NODE_ENV || 'development',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
})
```

### 3. Configure Migrations

Update `package.json`:

```json
{
  "scripts": {
    "migrate": "sh -c 'node node_modules/.c12/github_corsacca_nuxt_*/scripts/migrate.mjs'",
    "dev": "npm run migrate && nuxt dev",
    "build": "npm run migrate && nuxt build"
  }
}
```

### 4. Set Up Environment Variables

Create `.env` with:

```env
APP_TITLE=My App
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/db
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password
SMTP_SECURE=true
SMTP_FROM=noreply@example.com

# S3 Storage (optional)
S3_ENDPOINT=https://s3.example.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=your-bucket
```

### 5. Install and Run

```bash
npm install
npm run dev
```

## What's Included

| Category | Included |
|----------|----------|
| **Composables** | `useAuth()`, `useTheme()` |
| **Middleware** | `auth` (route protection) |
| **Pages** | `/`, `/login`, `/register`, `/dashboard`, `/profile`, `/reset-password` |
| **Server Utils** | JWT, password hashing, email, S3, database |
| **API Routes** | Auth endpoints, profile management |

## Overriding Defaults

Create files with the same name in your project to override:

- **Pages**: `app/pages/dashboard.vue` overrides the layer's dashboard
- **Components**: Your components take precedence over layer components
- **Layouts**: `app/layouts/default.vue` overrides the layer's layout

## Documentation

Copy `BASE_LAYER.md` to your project root for easy reference:

```bash
cp node_modules/.c12/github_corsacca_nuxt_*/BASE_LAYER.md .
```

This file contains the complete API reference for AI tools and developers, including:
- Composable APIs and usage examples
- Server utility functions
- Database schema
- Email templates
- Migration system details
