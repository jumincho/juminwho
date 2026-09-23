export type Theme = 'light' | 'dark'

/**
 * localStorage key for an explicit theme choice. The inline script in
 * index.html reads the same key before first paint; keep the two in sync.
 */
export const THEME_STORAGE_KEY = 'juminwho:theme'

export const darkQuery = '(prefers-color-scheme: dark)'

/** The theme the document is showing right now (`<html data-theme>`). */
export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private mode or blocked storage: the choice simply lasts for this visit.
  }
}

/** Applies a theme to the document and keeps the browser UI colour in step. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = theme
  // Read the token, not body's background: that one is mid-transition right now.
  const background = getComputedStyle(root).getPropertyValue('--bg').trim()
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', background)
  })
}
