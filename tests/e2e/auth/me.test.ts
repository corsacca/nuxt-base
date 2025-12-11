import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'
import { loginTestUser } from '../../helpers/auth'

describe('GET /api/auth/me', async () => {
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
    const response = await $fetch('/api/auth/me', {
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
  })

  it('returns user data when authenticated', async () => {
    const user = await createTestUser(sql, { verified: true, displayName: 'Me Test User' })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/auth/me', { headers })

    expect(response).toHaveProperty('user')
    expect(response.user).toHaveProperty('email', user.email)
    expect(response.user).toHaveProperty('display_name', 'Me Test User')
    expect(response.user).not.toHaveProperty('password')
  })

  it('returns 404 when user no longer exists', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    // Delete the user
    await sql`DELETE FROM users WHERE id = ${user.id}::uuid`

    const response = await $fetch('/api/auth/me', {
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 404)
  })
})
