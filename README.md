# Nuxt Base Layer

A Nuxt 4.2.0 base layer providing authentication, theme management, email, storage, and database utilities.

## Features

- **Authentication** - JWT-based auth with email verification and password reset
- **Theme System** - Light/dark mode with persistence
- **Email** - SMTP templated emails
- **S3 Storage** - File uploads with presigned URLs
- **Database** - PostgreSQL utilities with migrations

## Quick Start

**Recommended:** Use the [nuxt-base-template](https://github.com/corsacca/nuxt-base-template) for a complete starter with pages and layouts:

```bash
npx giget gh:corsacca/nuxt-base-template#master .
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm run dev
```

## What's Included

| Category | Included |
|----------|----------|
| **Composables** | `useAuth()`, `useTheme()` |
| **Components** | `ThemeToggle` |
| **Middleware** | `auth` (route protection) |
| **Layouts** | `default`, `auth` |
| **Pages** | `/login`, `/register`, `/dashboard`, `/profile`, `/reset-password` |
| **Server Utils** | JWT, password hashing, email, S3, database |
| **API Routes** | Auth endpoints, profile management |

**Note:** The template provides `app.vue` and a landing page (`pages/index.vue`). Auth pages and layouts come from the layer and receive automatic updates.

## Documentation

See `BASE_LAYER.md` in the [nuxt-base-template](https://github.com/corsacca/nuxt-base-template) for the complete API reference.
