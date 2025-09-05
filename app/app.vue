<template>
  <div class="container">
    <button class="theme-toggle" @click="toggleTheme">
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </button>
    <h1>Hello World</h1>
  </div>
</template>

<script setup>
const { theme, toggleTheme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
