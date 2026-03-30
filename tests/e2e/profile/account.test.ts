import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser, createPasswordResetRequest } from '../../helpers/db'
import { loginTestUser } from '../../helpers/auth'

describe('DELETE /api/profile/account', async () => {
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

  it('returns 401 when not authenticated', async () => {
    const response = await $fetch('/api/profile/account', {
      method: 'DELETE',
      body: { password: 'somepassword' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
  })

  it('returns 400 when password is missing', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/account', {
      method: 'DELETE',
      body: {},
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('required')
  })

  it('returns 401 when password is wrong', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/account', {
      method: 'DELETE',
      body: { password: 'wrongpassword' },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
    expect(response.statusMessage).toContain('incorrect')
  })

  it('deletes user and related data successfully', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    // Create a password reset request for this user
    await createPasswordResetRequest(sql, user.id)

    // Verify user exists before deletion
    const userBefore = await sql`SELECT id FROM users WHERE id = ${user.id}::uuid`
    expect(userBefore.length).toBe(1)

    // Delete the account
    const response = await $fetch('/api/profile/account', {
      method: 'DELETE',
      body: { password: user.password },
      headers,
    })

    expect(response).toHaveProperty('success', true)

    // Verify user is deleted
    const userAfter = await sql`SELECT id FROM users WHERE id = ${user.id}::uuid`
    expect(userAfter.length).toBe(0)

    // Verify password reset requests are deleted
    const resetRequests = await sql`SELECT * FROM password_reset_requests WHERE user_id = ${user.id}::uuid`
    expect(resetRequests.length).toBe(0)
  })

  it('clears auth cookie on success', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    // Delete the account
    const response = await $fetch('/api/profile/account', {
      method: 'DELETE',
      body: { password: user.password },
      headers,
    })

    expect(response).toHaveProperty('success', true)

    // Verify cannot access authenticated endpoint anymore
    const meResponse = await $fetch('/api/auth/me', {
      headers,
      ignoreResponseError: true,
    })

    expect(meResponse).toHaveProperty('statusCode', 401)
  })
})
