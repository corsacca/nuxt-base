import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'
import { loginTestUser } from '../../helpers/auth'

describe('PATCH /api/profile/password', async () => {
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
    const response = await $fetch('/api/profile/password', {
      method: 'PATCH',
      body: { current_password: 'old', new_password: 'newpassword' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
  })

  it('returns 400 when current_password is missing', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/password', {
      method: 'PATCH',
      body: { new_password: 'newpassword123' },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when new_password is missing', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/password', {
      method: 'PATCH',
      body: { current_password: user.password },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when new_password is too short', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/password', {
      method: 'PATCH',
      body: { current_password: user.password, new_password: '1234567' },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('at least 8')
  })

  it('returns 400 when new_password is same as current', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/password', {
      method: 'PATCH',
      body: { current_password: user.password, new_password: user.password },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('different')
  })

  it('returns 401 when current_password is wrong', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/password', {
      method: 'PATCH',
      body: { current_password: 'wrongpassword', new_password: 'newpassword123' },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
    expect(response.statusMessage).toContain('incorrect')
  })

  it('changes password successfully', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/password', {
      method: 'PATCH',
      body: { current_password: user.password, new_password: 'NewPassword456' },
      headers,
    })

    expect(response).toHaveProperty('success', true)

    // Verify can login with new password
    const loginResponse = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: user.email, password: 'NewPassword456' },
    })

    expect(loginResponse).toHaveProperty('success', true)
  })
})
