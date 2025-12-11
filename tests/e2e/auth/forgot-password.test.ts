import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'

describe('POST /api/auth/forgot-password', async () => {
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

  it('returns 400 when email is missing', async () => {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {},
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 for invalid email format', async () => {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: 'not-an-email' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('Invalid email')
  })

  it('returns success even for non-existent user (prevents enumeration)', async () => {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: 'test-nonexistent@example.com' },
    })

    expect(response).toHaveProperty('success', true)
  })

  it('returns success even when email fails to send', async () => {
    // Without SMTP config, email fails but endpoint still returns success
    // This is correct behavior to prevent timing attacks
    const user = await createTestUser(sql, { verified: true })

    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: user.email },
    })

    expect(response).toHaveProperty('success', true)
  })
})
