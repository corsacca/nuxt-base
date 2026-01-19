import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mockState, mockRoute, mockNavigateTo, resetMocks } from './setup'
import { useAuth } from '~/composables/useAuth'

// Mock $fetch
const mock$fetch = vi.fn()
vi.stubGlobal('$fetch', mock$fetch)

describe('useAuth', () => {
  beforeEach(() => {
    resetMocks()
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  describe('initial state', () => {
    it('returns null user initially', () => {
      const { user } = useAuth()
      expect(user.value).toBeNull()
    })

    it('returns false for authReady initially', () => {
      const { authReady } = useAuth()
      expect(authReady.value).toBe(false)
    })

    it('returns false for isLoggedIn when no user', () => {
      const { isLoggedIn } = useAuth()
      expect(isLoggedIn.value).toBe(false)
    })
  })

  describe('login', () => {
    it('sets user on successful login', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      mock$fetch.mockResolvedValueOnce({ success: true, user: mockUser })

      const { login, user } = useAuth()
      const result = await login('test@example.com', 'password')

      expect(result.success).toBe(true)
      expect(user.value).toEqual(mockUser)
      expect(mock$fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: { email: 'test@example.com', password: 'password' }
      })
    })

    it('navigates to home after successful login', async () => {
      mock$fetch.mockResolvedValueOnce({ success: true, user: { id: '123' } })

      const { login } = useAuth()
      await login('test@example.com', 'password')

      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('navigates to redirect URL if present', async () => {
      mockRoute.query = { redirect: '/dashboard' }
      mock$fetch.mockResolvedValueOnce({ success: true, user: { id: '123' } })

      const { login } = useAuth()
      await login('test@example.com', 'password')

      expect(mockNavigateTo).toHaveBeenCalledWith('/dashboard')
    })

    it('ignores external redirect URLs', async () => {
      mockRoute.query = { redirect: 'https://evil.com' }
      mock$fetch.mockResolvedValueOnce({ success: true, user: { id: '123' } })

      const { login } = useAuth()
      await login('test@example.com', 'password')

      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('returns error message on failed response', async () => {
      mock$fetch.mockResolvedValueOnce({ success: false })

      const { login } = useAuth()
      const result = await login('test@example.com', 'wrong')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Login failed')
    })

    it('returns API error message on exception', async () => {
      mock$fetch.mockRejectedValueOnce({ data: { message: 'Invalid credentials' } })

      const { login } = useAuth()
      const result = await login('test@example.com', 'wrong')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
    })

    it('returns default error on exception without message', async () => {
      mock$fetch.mockRejectedValueOnce(new Error('Network error'))

      const { login } = useAuth()
      const result = await login('test@example.com', 'wrong')

      expect(result.success).toBe(false)
      expect(result.message).toBe('An error occurred during login')
    })
  })

  describe('logout', () => {
    it('clears user and navigates to login', async () => {
      // Setup logged in state
      mockState['auth.user'] = ref({ id: '123' })
      mock$fetch.mockResolvedValueOnce({})

      const { logout, user } = useAuth()
      await logout()

      expect(mock$fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
      expect(user.value).toBeNull()
      expect(mockNavigateTo).toHaveBeenCalledWith('/login')
    })

    it('clears user even when API call fails', async () => {
      mockState['auth.user'] = ref({ id: '123' })
      mock$fetch.mockRejectedValueOnce(new Error('Network error'))

      const { logout, user } = useAuth()
      await logout()

      expect(user.value).toBeNull()
      expect(mockNavigateTo).toHaveBeenCalledWith('/login')
    })
  })

  describe('register', () => {
    it('calls register API with credentials', async () => {
      mock$fetch.mockResolvedValueOnce({
        success: true,
        message: 'Check your email',
        requiresVerification: true
      })

      const { register } = useAuth()
      const result = await register('new@example.com', 'password123', 'John Doe')

      expect(mock$fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        body: {
          email: 'new@example.com',
          password: 'password123',
          display_name: 'John Doe'
        }
      })
      expect(result.success).toBe(true)
      expect(result.requiresVerification).toBe(true)
    })

    it('returns error message on failure', async () => {
      mock$fetch.mockRejectedValueOnce({ data: { message: 'Email already exists' } })

      const { register } = useAuth()
      const result = await register('existing@example.com', 'password', 'John')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Email already exists')
    })

    it('returns default error on exception without message', async () => {
      mock$fetch.mockRejectedValueOnce(new Error('Network error'))

      const { register } = useAuth()
      const result = await register('new@example.com', 'password', 'John')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Registration failed')
    })
  })

  describe('checkAuth', () => {
    it('sets user from API response', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      mock$fetch.mockResolvedValueOnce({ user: mockUser })

      const { checkAuth, user } = useAuth()
      const result = await checkAuth()

      expect(mock$fetch).toHaveBeenCalledWith('/api/auth/me')
      expect(result).toEqual(mockUser)
      expect(user.value).toEqual(mockUser)
    })

    it('clears user and returns null on failure', async () => {
      mockState['auth.user'] = ref({ id: '123' })
      mock$fetch.mockRejectedValueOnce(new Error('Unauthorized'))

      const { checkAuth, user } = useAuth()
      const result = await checkAuth()

      expect(result).toBeNull()
      expect(user.value).toBeNull()
    })
  })

  describe('setAuthReady', () => {
    it('sets authReady to true', () => {
      const { setAuthReady, authReady } = useAuth()

      setAuthReady(true)

      expect(authReady.value).toBe(true)
    })

    it('sets authReady to false', () => {
      const { setAuthReady, authReady } = useAuth()
      setAuthReady(true)
      setAuthReady(false)

      expect(authReady.value).toBe(false)
    })
  })

  describe('isLoggedIn', () => {
    it('returns true when user exists', () => {
      mockState['auth.user'] = ref({ id: '123' })

      const { isLoggedIn } = useAuth()

      expect(isLoggedIn.value).toBe(true)
    })

    it('returns false when user is null', () => {
      mockState['auth.user'] = ref(null)

      const { isLoggedIn } = useAuth()

      expect(isLoggedIn.value).toBe(false)
    })
  })

  describe('restoreFromCache', () => {
    it('is a callable function', () => {
      const { restoreFromCache } = useAuth()
      expect(typeof restoreFromCache).toBe('function')
      expect(() => restoreFromCache()).not.toThrow()
    })
  })
})
