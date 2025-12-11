import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'

describe('POST /api/auth/register', async () => {
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
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { password: 'TestPassword123', display_name: 'Test User' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when password is missing', async () => {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: 'test-new@example.com', display_name: 'Test User' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when display_name is missing', async () => {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: 'test-new@example.com', password: 'TestPassword123' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when display_name is too short', async () => {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: 'test-new@example.com', password: 'TestPassword123', display_name: 'A' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('2 characters')
  })

  it('returns 409 when user already exists', async () => {
    const existingUser = await createTestUser(sql, { verified: true })

    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: existingUser.email, password: 'TestPassword123', display_name: 'Test User' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 409)
    expect(response.statusMessage).toContain('already exists')
  })

  it('registers new user successfully', async () => {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: 'test-register@example.com', password: 'TestPassword123', display_name: 'New User' },
    })

    expect(response).toHaveProperty('success', true)
    expect(response).toHaveProperty('requiresVerification', true)

    // Verify user was created in database
    const users = await sql`SELECT * FROM users WHERE email = 'test-register@example.com'`
    expect(users.length).toBe(1)
    expect(users[0].verified).toBe(false)
    expect(users[0].display_name).toBe('New User')
  })
})
