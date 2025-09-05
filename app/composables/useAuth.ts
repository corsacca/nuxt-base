// Global state for auth
const isLoggedIn = ref(false)
const user = ref<{ email: string } | null>(null)
let initialized = false

export const useAuth = () => {
  const login = (email: string, password: string) => {
    // Simple mock authentication - in real app, this would call an API
    if (email && password) {
      isLoggedIn.value = true
      user.value = { email }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', email)
      }
      
      return { success: true }
    }
    
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    isLoggedIn.value = false
    user.value = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userEmail')
    }
  }

  const initAuth = () => {
    if (!initialized && typeof window !== 'undefined') {
      const savedLoginState = localStorage.getItem('isLoggedIn')
      const savedEmail = localStorage.getItem('userEmail')
      
      if (savedLoginState === 'true' && savedEmail) {
        isLoggedIn.value = true
        user.value = { email: savedEmail }
      }
      
      initialized = true
    }
  }

  return {
    isLoggedIn: readonly(isLoggedIn),
    user: readonly(user),
    login,
    logout,
    initAuth
  }
}