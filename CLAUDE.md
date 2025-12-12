# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Nuxt 4.2.0 Base Layer** that provides backend functionality for Nuxt projects:
- Authentication system (JWT-based with bcrypt password hashing)
- Theme system (light/dark mode)
- Email functionality (via Nodemailer with SMTP)
- S3 storage integration (AWS SDK with presigned URLs)
- Database utilities (PostgreSQL via `postgres` package)
- @nuxt/ui integration

**Note:** Use the [nuxt-base-template](https://github.com/corsacca/nuxt-base-template) for quick project setup. It provides `app.vue` and a landing page; auth pages and layouts come from this layer.

## What This Layer Provides

### Auto-Imported Composables
- `useAuth()` - Authentication utilities (login, register, logout, password reset)
- `useTheme()` - Theme management (light/dark mode toggling)

### Components
- `ThemeToggle` - Button to toggle light/dark mode

### Middleware
- `auth` - Route protection middleware

### Layouts
- `default` - Main layout with header, user info, profile button
- `auth` - Centered layout for auth pages

### Pages
- `/login` - Login with forgot password
- `/register` - Registration with email verification
- `/reset-password` - Password reset flow
- `/dashboard` - Protected dashboard
- `/profile` - Profile management

### Server API Routes
- `/api/auth/*` - Authentication endpoints (login, register, logout, verify, forgot-password, reset-password)
- `/api/profile/*` - Profile management (name, email, password)

### Server Utilities
- JWT token generation and verification
- Password hashing with bcrypt
- Email sending via SMTP with templates
- S3 file operations
- Database connection utilities
- Activity logging
- Rate limiting

## Project Structure

```
app/
├── assets/css/default.css    # Global CSS with theme variables
├── components/               # ThemeToggle component
├── composables/              # useAuth, useTheme
└── middleware/               # auth middleware

server/
├── api/                      # API routes
│   ├── auth/                 # Authentication endpoints
│   └── profile/              # Profile endpoints
├── utils/                    # Server utilities
│   ├── auth.ts               # JWT and auth helpers
│   ├── database.ts           # PostgreSQL connection
│   ├── email.ts              # SMTP email sending
│   ├── storage.ts            # S3 operations
│   ├── activity-logger.ts    # Audit logging
│   └── rate-limit.ts         # Rate limiting
└── templates/                # Email templates

migrations/                   # Database migrations
scripts/migrate.mjs           # Migration runner
```

## Development Commands

- `npm run dev` - Start development server (runs migrations first)
- `npm run build` - Build for production (runs migrations first)
- `npm run migrate` - Run database migrations only

## Using This Layer

### Git Repository (Recommended)

```typescript
export default defineNuxtConfig({
  extends: ['github:corsacca/nuxt-base#master'],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    // ... see README.md for full config
  }
})
```

### Local Development

```typescript
export default defineNuxtConfig({
  extends: ['../base'],  // Relative path to this layer
  // ...
})
```

## Documentation

- `README.md` - Setup instructions
- `documentation/` - Nuxt 4.1 documentation
- `BASE_LAYER.md` - API reference (in the [nuxt-base-template](https://github.com/corsacca/nuxt-base-template))
