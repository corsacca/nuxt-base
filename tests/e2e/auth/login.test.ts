import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'

describe('POST /api/auth/login', async () => {
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
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: 'somepassword' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when password is missing', async () => {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: 'test@example.com' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 401 for non-existent user', async () => {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: 'nonexistent@example.com', password: 'anypassword' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
    expect(response).toHaveProperty('statusMessage', 'Invalid credentials')
  })

  it('returns 401 for wrong password', async () => {
    const user = await createTestUser(sql, { verified: true })

    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: user.email, password: 'wrongpassword' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
    expect(response).toHaveProperty('statusMessage', 'Invalid credentials')
  })

  it('returns 401 for unverified user', async () => {
    const user = await createTestUser(sql, { verified: false })

    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: user.email, password: user.password },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
    expect(response.statusMessage).toContain('verify')
  })

  it('returns user data on successful login', async () => {
    const user = await createTestUser(sql, { verified: true })

    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: user.email, password: user.password },
    })

    expect(response).toHaveProperty('success', true)
    expect(response.user).toHaveProperty('email', user.email)
    expect(response.user).toHaveProperty('display_name', user.displayName)
    expect(response.user).not.toHaveProperty('password')
  })
})
