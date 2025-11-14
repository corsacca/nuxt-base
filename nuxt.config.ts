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

  // Alias for server utilities
  alias: {
    '#server': fileURLToPath(new URL('./server', import.meta.url))
  },

  // Runtime config structure - consuming projects must provide actual values
  runtimeConfig: {
    // Private keys (only available on the server-side)
    // Consuming projects should set these via environment variables
    jwtSecret: '',
    databaseUrl: '',

    // SMTP configuration
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    smtpSecure: '',
    smtpFrom: '',
    smtpRejectUnauthorized: '',

    // S3 Storage configuration
    s3Endpoint: '',
    s3Region: '',
    s3AccessKeyId: '',
    s3SecretAccessKey: '',
    s3BucketName: '',

    // Public keys (exposed to the frontend)
    public: {
      nodeEnv: '',
      siteUrl: ''
    }
  }
})
