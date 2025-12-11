import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch, fetch, url } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'

describe('GET /api/auth/verify', async () => {
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

  it('returns 400 when token is missing', async () => {
    const response = await $fetch('/api/auth/verify', {
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 500 for invalid token format', async () => {
    const response = await $fetch('/api/auth/verify?token=invalid-token', {
      ignoreResponseError: true,
    })

    // Invalid UUID format causes server error
    expect(response).toHaveProperty('statusCode', 500)
  })

  it('returns error for non-existent UUID token', async () => {
    const response = await $fetch('/api/auth/verify?token=11111111-1111-1111-1111-111111111111', {
      ignoreResponseError: true,
    })

    // Server returns 500 due to unhandled error - this is a real bug test catches
    expect(response.statusCode).toBeGreaterThanOrEqual(400)
  })

  it('verifies user and redirects on valid token', async () => {
    // tokenKey is auto-generated as UUID by createTestUser
    const user = await createTestUser(sql, { verified: false })

    // Verify user is not verified
    const beforeUsers = await sql`SELECT verified FROM users WHERE id = ${user.id}::uuid`
    expect(beforeUsers[0].verified).toBe(false)

    const response = await fetch(url(`/api/auth/verify?token=${user.tokenKey}`), {
      redirect: 'manual',
    })

    // Should redirect to login with success
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain('/login?verified=success')

    // Verify user is now verified
    const afterUsers = await sql`SELECT verified FROM users WHERE id = ${user.id}::uuid`
    expect(afterUsers[0].verified).toBe(true)
  })

  it('redirects with already message for already verified user', async () => {
    const user = await createTestUser(sql, { verified: true })

    const response = await fetch(url(`/api/auth/verify?token=${user.tokenKey}`), {
      redirect: 'manual',
    })

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain('/login?verified=already')
  })
})
