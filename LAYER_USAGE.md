# Quick Start: Using This Base Layer

## Step 1: Create Your New Project

```bash
npx nuxi@latest init my-project
cd my-project
```

## Step 2: Configure Your Project to Extend This Layer

Edit `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Extend the base layer
  extends: [
    '../base'  // Adjust path to where this layer is located
  ],

  // Override SSR if needed
  ssr: true,  // The layer defaults to false

  // Add your deployment configuration
  nitro: {
    preset: 'vercel'  // Choose your deployment target
  },

  // Provide runtime configuration with your environment variables
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

## Step 3: Set Up Environment Variables

Copy the layer's `.env.example` to your project:

```bash
cp ../base/.env.example .env
```

Then edit `.env` and fill in your actual values.

## Step 4: Install Dependencies and Run

```bash
npm install
npm run dev
```

Your app will now have:
- Authentication system (`useAuth()` composable)
- Theme system (`useTheme()` composable)
- Auth middleware for protected routes
- All server utilities (JWT, email, S3, database)
- Pre-built pages (login, register, dashboard, profile)

## Customizing the Layer

### Override Pages

Create files with the same name in your `app/pages/` directory:

```
my-project/
  app/
    pages/
      index.vue      # Overrides layer's index page
      dashboard.vue  # Overrides layer's dashboard page
```

### Add Your Own Pages

Just create new pages in your `app/pages/` directory as normal.

### Override Components

Create components with the same name in your `app/components/` directory.

### Extend Composables

You can use the layer's composables and add your own:

```typescript
// app/composables/useMyFeature.ts
export const useMyFeature = () => {
  const auth = useAuth()  // From the layer
  // Your custom logic
}
```

### Customize Styles

You can:
1. Override CSS variables in your own CSS file
2. Add your own global CSS in `nuxt.config.ts`
3. Use Tailwind classes to customize components

## Using Layer Features

### Authentication

```vue
<script setup>
const auth = useAuth()

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value)
    navigateTo('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>
```

### Protected Routes

Add the auth middleware to any page:

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Theme Toggling

```vue
<script setup>
const theme = useTheme()

// Toggle theme
const toggle = () => {
  theme.toggleTheme()
}
</script>
```

### Server API

Server utilities are automatically available in your API routes:

```typescript
// server/api/my-endpoint.ts
export default defineEventHandler(async (event) => {
  // These utilities come from the layer
  const token = generateToken({ userId: 123 })
  await sendEmail({ to: 'user@example.com', subject: 'Hello' })
  // etc.
})
```

## Next Steps

- Read the full [README.md](./README.md) for complete documentation
- Check out the layer's pages to see example implementations
- Visit `/kitchen` in your app to see available UI components
- Customize the layer's defaults by overriding files in your project

## Troubleshooting

**Issue**: Layer not found
- **Solution**: Check the path in `extends` array matches the layer location

**Issue**: Environment variables not working
- **Solution**: Make sure your `.env` file is in your project root (not the layer)

**Issue**: Components not auto-importing
- **Solution**: Restart the dev server after adding new components

**Issue**: TypeScript errors
- **Solution**: Run `npm run postinstall` to regenerate Nuxt types
