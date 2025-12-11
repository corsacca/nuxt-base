import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'
import { loginTestUser } from '../../helpers/auth'

describe('POST /api/profile/email', async () => {
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
    const response = await $fetch('/api/profile/email', {
      method: 'POST',
      body: { new_email: 'new@example.com', current_password: 'password' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
  })

  it('returns 400 when new_email is missing', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/email', {
      method: 'POST',
      body: { current_password: user.password },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when current_password is missing', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/email', {
      method: 'POST',
      body: { new_email: 'test-newemail@example.com' },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 for invalid email format', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/email', {
      method: 'POST',
      body: { new_email: 'not-an-email', current_password: user.password },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('Invalid email')
  })

  it('returns 400 when new_email is same as current', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/email', {
      method: 'POST',
      body: { new_email: user.email, current_password: user.password },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('different')
  })

  it('returns 401 when current_password is wrong', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/email', {
      method: 'POST',
      body: { new_email: 'test-newemail@example.com', current_password: 'wrongpassword' },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
    expect(response.statusMessage).toContain('incorrect')
  })

  it('returns 400 when new email is already taken', async () => {
    const user = await createTestUser(sql, { verified: true })
    const otherUser = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/email', {
      method: 'POST',
      body: { new_email: otherUser.email, current_password: user.password },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('already in use')
  })

  it('initiates email change successfully', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/email', {
      method: 'POST',
      body: { new_email: 'test-newemail@example.com', current_password: user.password },
      headers,
    })

    expect(response).toHaveProperty('success', true)

    // Verify pending_email was set
    const users = await sql`SELECT pending_email, email_change_token FROM users WHERE id = ${user.id}::uuid`
    expect(users[0].pending_email).toBe('test-newemail@example.com')
    expect(users[0].email_change_token).toBeTruthy()
  })
})
