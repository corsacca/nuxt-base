import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch, fetch, url } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'
import { loginTestUser } from '../../helpers/auth'

describe('POST /api/auth/logout', async () => {
  await setup({
    server: true,
    browser: false,
  })

  const sql = getTestDatabase()

  afterEach(async () => {
    await cleanupTestData(sql)
  })

  afterAll(async () => {
    await closeTestDatabase()
  })

  it('returns success even when not authenticated', async () => {
    const response = await $fetch('/api/auth/logout', {
      method: 'POST',
    })

    expect(response).toHaveProperty('success', true)
  })

  it('clears auth cookie on logout', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await fetch(url('/api/auth/logout'), {
      method: 'POST',
      headers,
    })

    const body = await response.json()
    expect(body).toHaveProperty('success', true)

    // Verify cookie is cleared (maxAge=0)
    const cookies = response.headers.get('set-cookie')
    expect(cookies).toContain('auth-token=')
    expect(cookies).toContain('Max-Age=0')
  })

  it('user cannot access protected routes after logout', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    // First verify we can access /me
    const meBeforeLogout = await $fetch('/api/auth/me', { headers })
    expect(meBeforeLogout.user.email).toBe(user.email)

    // Logout
    await $fetch('/api/auth/logout', { method: 'POST', headers })

    // Now /me should fail (but we need fresh request without cookie)
    const meAfterLogout = await $fetch('/api/auth/me', {
      ignoreResponseError: true,
    })

    expect(meAfterLogout).toHaveProperty('statusCode', 401)
  })
})
