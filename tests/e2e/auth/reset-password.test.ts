import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser, createPasswordResetRequest } from '../../helpers/db'

describe('POST /api/auth/reset-password', async () => {
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
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { password: 'NewPassword123', confirmPassword: 'NewPassword123' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when passwords do not match', async () => {
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: 'some-token', password: 'NewPassword123', confirmPassword: 'DifferentPassword' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('do not match')
  })

  it('returns 400 when password is too short', async () => {
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: 'some-token', password: '12345', confirmPassword: '12345' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('at least 6')
  })

  it('returns 400 for invalid token', async () => {
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: 'invalid-token', password: 'NewPassword123', confirmPassword: 'NewPassword123' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('Invalid or expired')
  })

  it('returns 400 for expired token', async () => {
    const user = await createTestUser(sql, { verified: true })
    const resetRequest = await createPasswordResetRequest(sql, user.id, {
      expiresInMs: -1000, // Expired 1 second ago
    })

    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: resetRequest.token, password: 'NewPassword123', confirmPassword: 'NewPassword123' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('Invalid or expired')
  })

  it('returns 400 for already used token', async () => {
    const user = await createTestUser(sql, { verified: true })
    const resetRequest = await createPasswordResetRequest(sql, user.id, { used: true })

    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: resetRequest.token, password: 'NewPassword123', confirmPassword: 'NewPassword123' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('Invalid or expired')
  })

  it('resets password successfully', async () => {
    const user = await createTestUser(sql, { verified: true })
    const resetRequest = await createPasswordResetRequest(sql, user.id)

    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: resetRequest.token, password: 'NewPassword123', confirmPassword: 'NewPassword123' },
    })

    expect(response).toHaveProperty('success', true)

    // Verify user can login with new password
    const loginResponse = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: user.email, password: 'NewPassword123' },
    })

    expect(loginResponse).toHaveProperty('success', true)
  })

  it('marks token as used after reset', async () => {
    const user = await createTestUser(sql, { verified: true })
    const resetRequest = await createPasswordResetRequest(sql, user.id)

    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: resetRequest.token, password: 'NewPassword123', confirmPassword: 'NewPassword123' },
    })

    // Try to use the same token again
    const secondAttempt = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: resetRequest.token, password: 'AnotherPassword', confirmPassword: 'AnotherPassword' },
      ignoreResponseError: true,
    })

    expect(secondAttempt).toHaveProperty('statusCode', 400)
  })
})
