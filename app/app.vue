<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const { initTheme } = useTheme()
const { initAuth, isLoggedIn } = useAuth()
const router = useRouter()

onMounted(() => {
  initTheme()
  initAuth()
  
  // Redirect to appropriate page based on auth status
  if (process.client) {
    const currentPath = router.currentRoute.value.path
    if (currentPath === '/') {
      if (isLoggedIn.value) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }
})
</script>
