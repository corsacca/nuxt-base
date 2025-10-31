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
          <button class="theme-toggle outline" @click="toggleTheme" :data-theme="theme">
            <svg v-if="theme === 'light'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem !important;
}

.logout-button:hover {
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
