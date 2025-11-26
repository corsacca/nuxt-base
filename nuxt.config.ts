// https://nuxt.com/docs/api/configuration/nuxt-config
// Base Layer Configuration
// This layer provides authentication, theme system, and common utilities
// Consuming projects should extend this and provide their own deployment and runtime configurations

import {fileURLToPath} from "url";

const appTitle = process.env.APP_TITLE || 'Base'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules included in the layer
  modules: ['@nuxt/ui'],

  // Default to SPA mode (can be overridden by consuming projects)
  ssr: false,

  // Global CSS - use absolute path for layer compatibility
  css: [fileURLToPath(new URL('./app/assets/css/default.css', import.meta.url))],

  // Default app head configuration
  app: {
    head: {
      title: appTitle,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },


  // Runtime config structure - consuming projects must provide actual values
  runtimeConfig: {
    // Private keys (only available on the server-side)
    // Consuming projects should set these via environment variables
    appName: appTitle,
    jwtSecret: process.env.JWT_SECRET || '',
    databaseUrl: process.env.DATABASE_URL || '',

    // SMTP configuration
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpSecure: process.env.SMTP_SECURE || '',
    smtpFrom: process.env.SMTP_FROM || '',
    smtpFromName: process.env.SMTP_FROM_NAME || '',
    smtpRejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED || '',

    // S3 Storage configuration
    s3Endpoint: process.env.S3_ENDPOINT || '',
    s3Region: process.env.S3_REGION || '',
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    s3BucketName: process.env.S3_BUCKET_NAME || '',

    // Public keys (exposed to the frontend)
    public: {
      nodeEnv: process.env.NODE_ENV || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || ''
    }
  }
})
