<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Dashboard</h1>
        <div class="header-actions">
          <span class="user-info">Welcome, {{ user?.display_name || user?.email }}</span>
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
      <div class="dashboard-grid">
        <UCard>
          <template #header>
            <h3>Welcome Back!</h3>
          </template>
          <p>You are successfully logged in to your dashboard.</p>
        </UCard>

        <UCard>
          <template #header>
            <h3>Account Info</h3>
          </template>
          <div class="space-y-2">
            <p><strong>Name:</strong> {{ user?.display_name || 'Not set' }}</p>
            <p><strong>Email:</strong> {{ user?.email }}</p>
            <p><strong>Status:</strong> {{ user?.verified ? 'Verified' : 'Unverified' }}</p>
            <p v-if="user?.superadmin"><strong>Role:</strong> Super Admin</p>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3>Quick Actions</h3>
          </template>
          <div class="space-y-3">
            <UButton to="/profile" block>View Profile</UButton>
            <UButton block variant="outline">Settings</UButton>
            <UButton block variant="outline">Help</UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3>Recent Activity</h3>
          </template>
          <p>No recent activity to display.</p>
        </UCard>
      </div>
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

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Nuxt UI Card overrides for dashboard */
:deep([class*="Card"]) {
  border-color: var(--border) !important;
}

[data-theme="dark"] :deep([class*="Card"]) {
  background-color: var(--bg-secondary) !important;
}

:deep([class*="Card"] h3) {
  color: var(--text);
  font-size: 1.25rem;
  margin: 0;
}

:deep([class*="Card"] p) {
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0.5rem 0;
}

:deep([class*="Card"] strong) {
  color: var(--text);
}

/* Outline button overrides */
:deep(button[class*="outline"]) {
  background: transparent !important;
  color: var(--text) !important;
  border-color: var(--border) !important;
}

:deep(button[class*="outline"]:hover:not(:disabled)) {
  background: var(--bg-hover) !important;
}

/* Ensure proper spacing */
:deep(.space-y-3 > *) {
  margin-bottom: 0.75rem;
}

:deep(.space-y-3 > *:last-child) {
  margin-bottom: 0;
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
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>