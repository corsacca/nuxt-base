<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Dashboard</h1>
        <div class="header-actions">
          <span class="user-info">{{ user?.display_name || user?.email }}</span>
          <NuxtLink to="/profile" class="profile-link">
            Profile
          </NuxtLink>
          <button class="theme-toggle" @click="toggleTheme">
            {{ theme === 'light' ? '🌙' : '☀️' }}
          </button>
          <button class="logout-button" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- Dashboard content goes here -->
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { theme, toggleTheme, initTheme } = useTheme()
const { logout, user } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.dashboard-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  color: var(--text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.profile-link {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.profile-link:hover {
  background: var(--bg-hover);
}

.theme-toggle, .logout-button {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.theme-toggle {
  padding: 0.5rem;
  font-size: 1.2rem;
}

.logout-button:hover, .theme-toggle:hover {
  background: var(--bg-hover);
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
