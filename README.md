# Nuxt Base Layer

A comprehensive Nuxt 4.1.0 base layer providing authentication, theme management, and common utilities for rapid application development.

## Features

- **Authentication System**: JWT-based authentication with bcrypt password hashing
- **Theme System**: Light/dark mode with localStorage persistence and system preference detection
- **Email Integration**: Nodemailer with SMTP configuration
- **S3 Storage**: AWS SDK integration with presigned URL support
- **Database Utilities**: PostgreSQL connection and query utilities
- **@nuxt/ui**: Pre-configured with neutral color scheme
- **TypeScript**: Full TypeScript support with Nuxt's auto-configuration

## Quick Start

### 1. Using as a Local Layer

Create a new Nuxt project and extend this layer:

```bash
npx nuxi@latest init my-app
cd my-app
```

Update your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: [
    '../base'  // Relative path to this layer
  ],

  // Add your deployment configuration
  nitro: {
    preset: 'vercel'  // or 'node-server', 'cloudflare', etc.
  },

  // Provide runtime configuration
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

### 2. Using from Git Repository

```typescript
export default defineNuxtConfig({
  extends: [
    'github:yourorg/nuxt-base-layer#v1.0.0'
  ]
})
```

### 3. Using as NPM Package (if published)

```bash
npm install @yourorg/nuxt-base-layer
```

```typescript
export default defineNuxtConfig({
  extends: ['@yourorg/nuxt-base-layer']
})
```

## Environment Variables

Copy `.env.example` to your project and rename it to `.env`, then fill in your values:

```bash
cp ../base/.env.example .env
```

Required environment variables:
- `JWT_SECRET` - Secret key for JWT token generation
- `DATABASE_URL` - PostgreSQL connection string
- `SMTP_*` - Email configuration (host, port, credentials)
- `S3_*` - S3 storage configuration (endpoint, region, credentials)
- `NUXT_PUBLIC_SITE_URL` - Your application URL

## What's Included

### Composables (Auto-imported)

- **`useAuth()`**: Authentication utilities
  - `login(email, password)`
  - `register(email, password, name)`
  - `logout()`
  - `resetPassword(email)`
  - `getUser()`

- **`useTheme()`**: Theme management
  - `initTheme()` - Initialize theme from localStorage/system preference
  - `toggleTheme()` - Toggle between light/dark mode
  - `theme` - Current theme reactive ref

### Middleware

- **`auth.ts`**: Protect routes requiring authentication

### Server Utilities

Located in `server/utils/`:
- **JWT**: Token generation and verification
- **Password**: Bcrypt hashing and verification
- **Email**: SMTP email sending with templates
- **S3**: File upload/download with presigned URLs
- **Database**: PostgreSQL connection and query utilities

### API Routes

Located in `server/api/`:
- Authentication endpoints (login, register, logout, password reset)
- User profile management
- File upload/download

### Pages (Override in Your Project)

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard
- `/profile` - User profile management
- `/reset-password` - Password reset flow
- `/kitchen` - UI component showcase

### Styling

- **Global CSS**: Black/white theme system with CSS custom properties
- **@nuxt/ui**: Pre-configured with neutral colors
- **Tailwind CSS**: Full Tailwind support with custom configuration
- **Dark Mode**: Automatic system preference detection

## Development

This layer can be developed independently:

```bash
npm install
npm run dev
```

## Overriding Layer Defaults

### Override Pages

Create pages in your project's `app/pages/` directory with the same name to override layer pages.

### Override Components

Components in your project take precedence over layer components with the same name.

### Override Styles

Layer styles can be overridden by:
1. Adding your own CSS in your project's `nuxt.config.ts`
2. Using Tailwind utility classes
3. Overriding CSS custom properties

### Override Configuration

All `nuxt.config.ts` settings can be overridden in your consuming project. Settings are merged with your project's configuration taking precedence.

## Layer Priority

When using multiple layers:
1. Your project files (highest priority)
2. Layers in `~/layers` (alphabetically)
3. Layers in `extends` array (first = highest priority)

## Best Practices

1. **Environment Variables**: Always provide runtime config through environment variables in consuming projects
2. **Database Migrations**: Run migrations in your consuming project, not in the layer
3. **Customization**: Override pages and components rather than modifying the layer directly
4. **Deployment**: Configure deployment settings (`nitro.preset`) in your consuming project
5. **Dependencies**: The layer's dependencies are automatically available to consuming projects

## Documentation

Comprehensive Nuxt 4.1 documentation is available in the `documentation/` folder.

## License

[Your License Here]
