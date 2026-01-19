import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'

const TEST_SECRET = 'test-jwt-secret-key'
const TEST_USER = { userId: '123', email: 'test@example.com', display_name: 'Test User' }

// Mock Nuxt/H3 auto-imports
const mockGetCookie = vi.fn()
vi.stubGlobal('useRuntimeConfig', () => ({ jwtSecret: TEST_SECRET }))
vi.stubGlobal('getCookie', mockGetCookie)
vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage: string }) => {
  const error = new Error(opts.statusMessage) as Error & { statusCode: number }
  error.statusCode = opts.statusCode
  return error
})

// Import after mocks are set up
import { verifyToken, requireAuth, getAuthUser } from '../../server/utils/auth'

// Helper to create test tokens
function createTestToken(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, TEST_SECRET, options)
}

function createTokenWithWrongSecret(payload: object) {
  return jwt.sign(payload, 'wrong-secret')
}

describe('server/utils/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('verifyToken', () => {
    it('returns decoded payload for valid token', () => {
      const token = createTestToken(TEST_USER)

      const result = verifyToken(token)

      expect(result).toMatchObject(TEST_USER)
    })

    it('returns null for invalid token', () => {
      const result = verifyToken('invalid-token-string')

      expect(result).toBeNull()
    })

    it('returns null for expired token', () => {
      const token = createTestToken(TEST_USER, { expiresIn: '-1s' })

      const result = verifyToken(token)

      expect(result).toBeNull()
    })

    it('returns null for token signed with wrong secret', () => {
      const token = createTokenWithWrongSecret(TEST_USER)

      const result = verifyToken(token)

      expect(result).toBeNull()
    })
  })

  describe('requireAuth', () => {
    const mockEvent = {} as any

    it('returns user when valid auth-token cookie present', () => {
      const token = createTestToken(TEST_USER)
      mockGetCookie.mockReturnValue(token)

      const result = requireAuth(mockEvent)

      expect(mockGetCookie).toHaveBeenCalledWith(mockEvent, 'auth-token')
      expect(result).toMatchObject(TEST_USER)
    })

    it('throws 401 error when no cookie present', () => {
      mockGetCookie.mockReturnValue(undefined)

      expect(() => requireAuth(mockEvent)).toThrow('Authentication required')
      try {
        requireAuth(mockEvent)
      } catch (error: any) {
        expect(error.statusCode).toBe(401)
      }
    })

    it('throws 401 error when token is invalid', () => {
      mockGetCookie.mockReturnValue('invalid-token')

      expect(() => requireAuth(mockEvent)).toThrow('Authentication required')
      try {
        requireAuth(mockEvent)
      } catch (error: any) {
        expect(error.statusCode).toBe(401)
      }
    })
  })

  describe('getAuthUser', () => {
    const mockEvent = {} as any

    it('returns user when valid auth-token cookie present', () => {
      const token = createTestToken(TEST_USER)
      mockGetCookie.mockReturnValue(token)

      const result = getAuthUser(mockEvent)

      expect(mockGetCookie).toHaveBeenCalledWith(mockEvent, 'auth-token')
      expect(result).toMatchObject(TEST_USER)
    })

    it('returns null when no cookie present', () => {
      mockGetCookie.mockReturnValue(undefined)

      const result = getAuthUser(mockEvent)

      expect(result).toBeNull()
    })

    it('returns null when token is invalid', () => {
      mockGetCookie.mockReturnValue('invalid-token')

      const result = getAuthUser(mockEvent)

      expect(result).toBeNull()
    })
  })
})
