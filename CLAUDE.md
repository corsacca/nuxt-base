# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt.js 4.1.0 application with Vue 3, configured as an ES module project. The project uses TypeScript with Nuxt's automatic TypeScript configuration system.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Generate static site**: `npm run generate`
- **Preview production build**: `npm run preview`
- **Prepare Nuxt (post-install)**: `npm run postinstall`

## Project Structure

- `app/app.vue` - Main application entry point with NuxtWelcome component
- `nuxt.config.ts` - Nuxt configuration with devtools enabled
- `tsconfig.json` - TypeScript configuration using Nuxt's reference system
- `public/` - Static assets (favicon, robots.txt)

## TypeScript Configuration

The project uses Nuxt's automatic TypeScript configuration system. The main `tsconfig.json` references generated configurations in `.nuxt/` directory:
- `.nuxt/tsconfig.app.json` - App-specific TypeScript config
- `.nuxt/tsconfig.server.json` - Server-side TypeScript config
- `.nuxt/tsconfig.shared.json` - Shared TypeScript config
- `.nuxt/tsconfig.node.json` - Node.js TypeScript config

## Nuxt Configuration

- Compatibility date: 2025-07-15
- Devtools enabled for development
- Uses Nuxt 4.x with Vue 3.5+ and Vue Router 4.5+