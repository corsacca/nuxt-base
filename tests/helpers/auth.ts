import { fetch, url } from '@nuxt/test-utils/e2e'

export async function loginTestUser(email: string, password: string) {
  const response = await fetch(url('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const cookies = response.headers.get('set-cookie')
  const authCookie = cookies?.split(';')[0]

  return {
    cookie: authCookie || '',
    headers: { cookie: authCookie || '' },
  }
}
