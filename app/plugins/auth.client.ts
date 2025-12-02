export default defineNuxtPlugin(async () => {
  const { restoreFromCache, checkAuth, setAuthReady } = useAuth()

  // Step 1: Instantly restore from sessionStorage cache (no API call, no spinner)
  restoreFromCache()

  // Step 2: Validate with server in background
  // This ensures the cache is still valid (user wasn't logged out elsewhere)
  await checkAuth()

  // Step 3: Mark auth as ready
  setAuthReady(true)
})
