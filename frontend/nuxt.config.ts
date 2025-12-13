// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-13',

  // Nuxt automatically reads environment variables and exposes them via runtimeConfig.
  // Variables prefixed with NUXT_PUBLIC_ are exposed to the frontend.
  runtimeConfig: {
    public: {
      // The environment variable NUXT_PUBLIC_API_BASE_URL will override the default value.
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api',
    }
  },
  
  // Enable devtools for development
  devtools: { enabled: true },
  
  // CSS files to include
  css: [
    // CSS/Sass files can be added here later
  ],
})
