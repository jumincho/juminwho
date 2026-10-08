import { withViewTransition } from './motion'
import { subscribeToMedia } from './subscribe'

export type Theme = 'light' | 'dark'

/**
 * localStorage key for an explicit theme choice. The inline script in
 * index.html reads the same key before first paint; keep the two in sync.
 */
export const THEME_STORAGE_KEY = 'juminwho:theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/** The theme the document is showing right now (`<html data-theme>`). */
export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private mode or blocked storage: the choice simply lasts for this visit.
  }
}

/** Applies a theme to the document and keeps the browser UI colour in step. */
function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = theme
  // Read the token, not the page's background colour: that one may be mid-transition right now.
  const background = getComputedStyle(root).getPropertyValue('--bg').trim()
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', background)
  })
}

/** Calls `listener` whenever `<html data-theme>` changes, whoever changed it. */
export function subscribeToTheme(listener: () => void): () => void {
  const observer = new MutationObserver(listener)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

/**
 * Runs once at start-up. index.html has already applied the stored or system
 * theme; this aligns the theme-color metas with it, then keeps following the
 * operating system until the visitor picks a theme.
 */
export function followSystemTheme(): void {
  applyTheme(readTheme())
  subscribeToMedia(DARK_QUERY)(() => {
    if (!readStoredTheme()) applyTheme(window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light')
  })
}

/** The theme a transition is about to apply, so a quick second click still flips it back. */
let pending: Theme | null = null

/**
 * Switches to the other theme and remembers the choice. Where view
 * transitions run, the new theme spreads from `origin` (the toggle's centre,
 * in viewport px) in a growing circle, like a lamp coming on.
 */
export function toggleTheme(origin?: { x: number; y: number }): void {
  const next: Theme = (pending ?? readTheme()) === 'dark' ? 'light' : 'dark'
  pending = next
  const transition = withViewTransition('theme', () => {
    applyTheme(next)
    storeTheme(next)
    if (pending === next) pending = null
  })
  if (!transition || !origin) return
  const { x, y } = origin
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 720, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    // `ready` rejects when another transition cuts this one short; the theme has switched anyway.
    .catch(() => {})
}
