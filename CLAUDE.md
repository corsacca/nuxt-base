# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Nuxt 4.1.0 Base Layer** designed to be extended by other Nuxt projects. It provides:
- Authentication system (JWT-based with bcrypt password hashing)
- Theme system (light/dark mode with localStorage persistence)
- Email functionality (via Nodemailer with SMTP)
- S3 storage integration (AWS SDK with presigned URLs)
- Database utilities (PostgreSQL via `postgres` package)
- @nuxt/ui integration with custom theme configuration

The project is configured as an ES module and uses TypeScript with Nuxt's automatic TypeScript configuration system.

## Using This Layer in Your Nuxt Project

### Method 1: Local Layer (Recommended for Development)

In your consuming project's `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: [
    '../base'  // Relative path to this layer
  ],

  // Override layer defaults
  ssr: true,  // Enable SSR if needed

  // Add your deployment configuration
  nitro: {
    preset: 'vercel',  // or 'node-server', 'cloudflare', etc.
  },

  // Provide runtime configuration
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    smtpHost: process.env.SMTP_HOST,
    // ... other environment variables

    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
})
```

### Method 2: Git Repository

```typescript
export default defineNuxtConfig({
  extends: [
    'github:yourorg/nuxt-base-layer#main'  // or use a specific tag like #v1.0.0
  ],
  // ... rest of your config
})
```

### Method 3: NPM Package (if published)

```bash
npm install @yourorg/nuxt-base-layer
```

```typescript
export default defineNuxtConfig({
  extends: ['@yourorg/nuxt-base-layer'],
  // ... rest of your config
})
```

## What This Layer Provides

### Auto-Imported Composables
- `useAuth()` - Authentication utilities (login, register, logout, password reset)
- `useTheme()` - Theme management (light/dark mode toggling)

### Middleware
- `auth.ts` - Route protection middleware

### Pages (Override These in Your Project)
- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile page
- `/reset-password` - Password reset page
- `/dashboard` - Protected dashboard page
- `/kitchen` - UI component showcase

### Server API Utilities
- JWT token generation and verification
- Password hashing with bcrypt
- Email sending via SMTP
- S3 file operations
- Database connection utilities

### Styling
- Global CSS with theme variables (black/white theme system)
- @nuxt/ui with neutral color scheme
- Tailwind CSS configured

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Generate static site**: `npm run generate`
- **Preview production build**: `npm run preview`
- **Prepare Nuxt (post-install)**: `npm run postinstall`

## Project Structure

- `app/app.vue` - Main application entry point with theme toggle functionality
- `app/assets/css/default.css` - Global CSS with black/white theme variables
- `app/composables/useTheme.ts` - Theme management composable
- `nuxt.config.ts` - Nuxt configuration with devtools enabled, SSR disabled
- `tsconfig.json` - TypeScript configuration using Nuxt's reference system
- `public/` - Static assets (favicon, robots.txt)
- `documentation/` - Comprehensive Nuxt 4.1 documentation

## Key Directories

- `app/assets/` - Static assets (images, styles, fonts)
- `app/components/` - Auto-imported Vue components
- `app/composables/` - Reusable composition functions
- `app/layouts/` - Page layout structures
- `app/pages/` - File-based routing
- `app/utils/` - Auto-imported utility functions

## Auto-Import Features

- Vue APIs (`ref`, `computed`, `onMounted`)
- Nuxt composables (`useFetch`, `useRoute`)
- Custom composables from `app/composables/`
- Components from `app/components/`
- Utilities from `app/utils/`

## Styling System

- Black and white theme system with light/dark mode support
- Global CSS via `css: ['~/assets/css/default.css']` in nuxt.config.ts
- CSS custom properties for theme variables
- Theme toggle button in top-right corner
- LocalStorage persistence and system preference detection

## Styling Options

- Local stylesheets in components
- Global CSS via nuxt.config.ts
- Preprocessors (SCSS, Less, Stylus)
- PostCSS integration
- Third-party frameworks (Tailwind, UnoCSS, etc.)

## TypeScript Configuration

The project uses Nuxt's automatic TypeScript configuration system. The main `tsconfig.json` references generated configurations in `.nuxt/` directory:
- `.nuxt/tsconfig.app.json` - App-specific TypeScript config
- `.nuxt/tsconfig.server.json` - Server-side TypeScript config
- `.nuxt/tsconfig.shared.json` - Shared TypeScript config
- `.nuxt/tsconfig.node.json` - Node.js TypeScript config

## Nuxt Configuration

- Compatibility date: 2025-07-15
- Devtools enabled for development
- SSR disabled (SPA mode)
- Uses Nuxt 4.x with Vue 3.5+ and Vue Router 4.5+

## Documentation

Comprehensive Nuxt 4.1 documentation is available in the `documentation/` folder:
- `nuxt-4x-introduction.md` - Framework overview and key features
- `nuxt-4x-installation.md` - Installation guide and prerequisites
- `nuxt-4x-directory-structure.md` - App directory structure and organization
- `nuxt-4x-auto-imports.md` - Auto-import system for composables, components, and utils
- `nuxt-4x-styling.md` - Styling approaches, CSS imports, and preprocessors

For the most up-to-date information, refer to the official [Nuxt 4.x Documentation](https://nuxt.com/docs/4.x).