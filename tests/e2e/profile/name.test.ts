import { describe, it, expect, afterEach, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getTestDatabase, closeTestDatabase, cleanupTestData, createTestUser } from '../../helpers/db'
import { loginTestUser } from '../../helpers/auth'

describe('PATCH /api/profile/name', async () => {
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
    const response = await $fetch('/api/profile/name', {
      method: 'PATCH',
      body: { display_name: 'New Name' },
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 401)
  })

  it('returns 400 when display_name is missing', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/name', {
      method: 'PATCH',
      body: {},
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when display_name is empty', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/name', {
      method: 'PATCH',
      body: { display_name: '   ' },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('returns 400 when display_name is too long', async () => {
    const user = await createTestUser(sql, { verified: true })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/name', {
      method: 'PATCH',
      body: { display_name: 'a'.repeat(101) },
      headers,
      ignoreResponseError: true,
    })

    expect(response).toHaveProperty('statusCode', 400)
    expect(response.statusMessage).toContain('too long')
  })

  it('updates display name successfully', async () => {
    const user = await createTestUser(sql, { verified: true, displayName: 'Old Name' })
    const { headers } = await loginTestUser(user.email, user.password)

    const response = await $fetch('/api/profile/name', {
      method: 'PATCH',
      body: { display_name: 'New Name' },
      headers,
    })

    expect(response).toHaveProperty('success', true)
    expect(response.user).toHaveProperty('display_name', 'New Name')

    // Verify in database
    const users = await sql`SELECT display_name FROM users WHERE id = ${user.id}::uuid`
    expect(users[0].display_name).toBe('New Name')
  })
})
