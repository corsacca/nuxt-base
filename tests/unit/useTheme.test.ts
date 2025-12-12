import { describe, it, expect, beforeEach } from 'vitest'
import { mockColorMode, resetMocks } from './setup'
import { useTheme } from '~/composables/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    resetMocks()
  })

  describe('theme computed', () => {
    it('returns current theme value from colorMode', () => {
      mockColorMode.value = 'light'
      const { theme } = useTheme()
      expect(theme.value).toBe('light')
    })

    it('reflects dark mode when colorMode is dark', () => {
      mockColorMode.value = 'dark'
      const { theme } = useTheme()
      expect(theme.value).toBe('dark')
    })
  })

  describe('toggleTheme', () => {
    it('switches from light to dark', () => {
      mockColorMode.value = 'light'
      mockColorMode.preference = 'light'

      const { toggleTheme } = useTheme()
      toggleTheme()

      expect(mockColorMode.preference).toBe('dark')
    })

    it('switches from dark to light', () => {
      mockColorMode.value = 'dark'
      mockColorMode.preference = 'dark'

      const { toggleTheme } = useTheme()
      toggleTheme()

      expect(mockColorMode.preference).toBe('light')
    })
  })

  describe('initTheme', () => {
    it('is a no-op function that does not throw', () => {
      const { initTheme } = useTheme()
      expect(() => initTheme()).not.toThrow()
    })
  })
})
