// https://nuxt.com/docs/api/configuration/nuxt-config
// Base Layer Configuration
// This layer provides authentication, theme system, and common utilities
// Consuming projects should extend this and provide their own deployment and runtime configurations

import {fileURLToPath} from "url";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules included in the layer
  modules: ['@nuxt/ui'],

  // Default to SPA mode (can be overridden by consuming projects)
  ssr: false,

  // Layer styles
  css: ['~/assets/css/main.css'],

  // Default app head configuration
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },

  // Theme configuration
  colorMode: {
    preference: 'light',
    classSuffix: ''
  },

  ui: {
    primary: 'gray',
    gray: 'neutral'
  },

  // Runtime config structure - consuming projects must provide actual values
  runtimeConfig: {
    // Private keys (only available on the server-side)
    // Consuming projects should set these via environment variables
    jwtSecret: process.env.JWT_SECRET || '',
    databaseUrl: process.env.DATABASE_URL || '',

    // SMTP configuration
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpSecure: process.env.SMTP_SECURE || '',
    smtpFrom: process.env.SMTP_FROM || '',
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
