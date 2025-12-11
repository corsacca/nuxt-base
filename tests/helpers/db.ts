import postgres from 'postgres'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

let testDb: ReturnType<typeof postgres> | null = null

export function getTestDatabase() {
  if (testDb) return testDb

  const connectionString = process.env.TEST_DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'TEST_DATABASE_URL environment variable is required for tests.\n' +
      'Create a Neon test branch and set TEST_DATABASE_URL in your environment.\n' +
      'DO NOT run tests against your production database.'
    )
  }

  testDb = postgres(connectionString, {
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    max: 5,
    idle_timeout: 10,
  })

  return testDb
}

export async function closeTestDatabase() {
  if (testDb) {
    await testDb.end()
    testDb = null
  }
}

export async function cleanupTestData(sql: ReturnType<typeof postgres>) {
  await sql`DELETE FROM activity_logs WHERE metadata->>'email' LIKE 'test-%@example.com'`
  await sql`DELETE FROM password_reset_requests WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-%@example.com')`
  await sql`DELETE FROM users WHERE email LIKE 'test-%@example.com'`
}

export async function createTestUser(
  sql: ReturnType<typeof postgres>,
  options: {
    email?: string
    password?: string
    displayName?: string
    verified?: boolean
    tokenKey?: string
  } = {}
) {
  const id = uuidv4()
  const email = options.email || `test-${id.slice(0, 8)}@example.com`
  const password = options.password || 'TestPassword123'
  const displayName = options.displayName || 'Test User'
  const verified = options.verified ?? true
  const tokenKey = options.tokenKey || uuidv4()

  const passwordHash = await bcrypt.hash(password, 10)
  const now = new Date().toISOString()

  await sql`
    INSERT INTO users (id, email, display_name, password, verified, superadmin, created, updated, token_key)
    VALUES (${id}::uuid, ${email}, ${displayName}, ${passwordHash}, ${verified}, false, ${now}, ${now}, ${tokenKey})
  `

  return { id, email, password, displayName, verified, tokenKey }
}

export async function createPasswordResetRequest(
  sql: ReturnType<typeof postgres>,
  userId: string,
  options: {
    token?: string
    expiresInMs?: number
    used?: boolean
  } = {}
) {
  const token = options.token || uuidv4()
  const expiresInMs = options.expiresInMs ?? 60 * 60 * 1000 // 1 hour
  const expires = new Date(Date.now() + expiresInMs).toISOString()
  const used = options.used ?? false

  await sql`
    INSERT INTO password_reset_requests (user_id, token, expires, used)
    VALUES (${userId}::uuid, ${token}, ${expires}, ${used})
  `

  return { token, expires, used }
}
