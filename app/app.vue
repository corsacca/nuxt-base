<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup>
// Import layer styles
import '~/assets/css/main.css'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
