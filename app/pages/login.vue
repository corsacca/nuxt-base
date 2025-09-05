<template>
  <div class="login-container">
    <button class="theme-toggle" @click="toggleTheme">
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </button>
    
    <div class="login-card">
      <h1>Login</h1>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
const { theme, toggleTheme, initTheme } = useTheme()
const { login, isLoggedIn } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  const result = login(email.value, password.value)
  
  if (result.success) {
    await router.push('/dashboard')
  } else {
    errorMessage.value = result.error || 'Login failed'
  }
  
  isLoading.value = false
}

// Redirect if already logged in (with a delay to avoid race conditions)  
watchEffect(() => {
  if (isLoggedIn.value) {
    nextTick(() => {
      router.push('/dashboard')
    })
  }
})

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
}

.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.login-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-card h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text);
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--text);
}

.login-button {
  padding: 0.75rem;
  background: var(--text);
  color: var(--bg);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background: var(--text-muted);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: var(--text);
  text-align: center;
  margin-top: 0.5rem;
  font-weight: 500;
}
</style>