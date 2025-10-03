<template>
  <div class="login-container">
    <button class="theme-toggle" @click="toggleTheme">
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </button>
    
    <div class="login-card">
      <h1>{{ isRegistering ? 'Register' : 'Login' }}</h1>
      
      <!-- Email Verification Success Message -->
      <div v-if="showVerificationMessage" class="verification-message">
        <div class="success-icon">📧</div>
        <h3>Check Your Email!</h3>
        <p>{{ successMessage }}</p>
        <p class="verification-note">
          Click the verification link in your email to activate your account, then return here to log in.
        </p>
        <button type="button" @click="showVerificationMessage = false" class="close-message-button">
          Got it
        </button>
      </div>
      
      <!-- Login/Register Form -->
      <form v-else @submit.prevent="handleSubmit" class="login-form">
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
            :placeholder="isRegistering ? 'Create a password (min 6 chars)' : 'Enter your password'"
            :minlength="isRegistering ? 6 : undefined"
          />
        </div>
        
        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? (isRegistering ? 'Creating account...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login') }}
        </button>
        
        <button type="button" @click="toggleMode" class="toggle-button">
          {{ isRegistering ? 'Already have an account? Login' : 'Need an account? Register' }}
        </button>
        
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage && !showVerificationMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
const { theme, toggleTheme, initTheme } = useTheme()
const { login, register, isLoggedIn } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isRegistering = ref(false)
const showVerificationMessage = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  const result = isRegistering.value 
    ? await register(email.value, password.value)
    : await login(email.value, password.value)
  
  if (result.success) {
    if (result.requiresVerification) {
      // Show verification message instead of redirecting
      showVerificationMessage.value = true
      successMessage.value = result.message || 'Please check your email to verify your account.'
    } else {
      await router.push('/dashboard')
    }
  } else {
    errorMessage.value = result.error || `${isRegistering.value ? 'Registration' : 'Login'} failed`
  }
  
  isLoading.value = false
}

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  errorMessage.value = ''
  successMessage.value = ''
  showVerificationMessage.value = false
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
  
  // Handle URL parameters for verification status
  const route = useRoute()
  
  if (route.query.verified === 'true') {
    successMessage.value = '✅ Email verified successfully! You can now log in.'
  } else if (route.query.error === 'invalid_token') {
    errorMessage.value = 'Invalid or expired verification link. Please register again.'
  } else if (route.query.error === 'verification_failed') {
    errorMessage.value = 'Email verification failed. Please try again or register again.'
  } else if (route.query.info === 'already_verified') {
    successMessage.value = 'Email already verified! You can log in.'
  }
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

.toggle-button {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  margin-top: 1rem;
  padding: 0;
}

.toggle-button:hover {
  color: var(--text);
}

.error-message {
  color: var(--text);
  text-align: center;
  margin-top: 0.5rem;
  font-weight: 500;
}

.success-message {
  color: var(--text);
  text-align: center;
  margin-top: 0.5rem;
  font-weight: 500;
}

.verification-message {
  text-align: center;
  padding: 2rem 1rem;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.verification-message h3 {
  margin: 0 0 1rem 0;
  color: var(--text);
  font-size: 1.5rem;
}

.verification-message p {
  margin: 0.5rem 0;
  color: var(--text);
  line-height: 1.5;
}

.verification-note {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 1.5rem 0 2rem 0 !important;
}

.close-message-button {
  background: var(--text);
  color: var(--bg);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 1rem;
}

.close-message-button:hover {
  background: var(--text-muted);
}
</style>