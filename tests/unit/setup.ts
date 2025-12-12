import { vi } from 'vitest'
import { ref, computed, readonly } from 'vue'

// Shared mock state
export const mockState: Record<string, any> = {}
export const mockRoute = { query: {} as Record<string, string> }
export const mockNavigateTo = vi.fn()
export const mockColorMode = {
  value: 'light' as string,
  preference: 'light' as string
}

// Reset function
export function resetMocks() {
  Object.keys(mockState).forEach(key => delete mockState[key])
  mockRoute.query = {}
  mockNavigateTo.mockClear()
  mockColorMode.value = 'light'
  mockColorMode.preference = 'light'
}

// Stub Nuxt auto-imports as globals
vi.stubGlobal('useState', (key: string, init: () => any) => {
  if (!(key in mockState)) {
    mockState[key] = ref(init())
  }
  return mockState[key]
})

vi.stubGlobal('useRoute', () => mockRoute)
vi.stubGlobal('navigateTo', mockNavigateTo)
vi.stubGlobal('useColorMode', () => mockColorMode)
vi.stubGlobal('computed', computed)
vi.stubGlobal('readonly', readonly)
