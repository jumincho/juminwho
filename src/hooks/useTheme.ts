import { useCallback, useEffect, useState } from 'react'
import { applyTheme, darkQuery, readStoredTheme, readTheme, storeTheme, type Theme } from '../lib/theme'

/**
 * Current theme plus a toggle. index.html has already applied the stored or
 * system theme before first paint; until the visitor picks one, the page keeps
 * following the operating system.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    // The theme-color metas follow the OS; align them with a stored choice that differs.
    applyTheme(readTheme())
    const media = window.matchMedia(darkQuery)
    const onChange = () => {
      if (readStoredTheme()) return
      const next = media.matches ? 'dark' : 'light'
      applyTheme(next)
      setTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next = readTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    storeTheme(next)
    setTheme(next)
  }, [])

  return { theme, toggle }
}
