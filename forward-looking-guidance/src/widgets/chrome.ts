import { h } from '../lib/dom'
import { prefersReducedMotion } from '../lib/motion'

/** The page around the figures: the theme, the back-to-top button and the BibTeX copy button. */

type Theme = 'light' | 'dark'

/** Shared with the portfolio (THEME_STORAGE_KEY in src/lib/theme.ts): one origin, one choice. */
const THEME_KEY = 'juminwho:theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const readTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function initTheme(): void {
  const button = document.querySelector<HTMLButtonElement>('.theme-toggle')

  const apply = (theme: Theme) => {
    const root = document.documentElement
    root.dataset.theme = theme
    const background = getComputedStyle(root).getPropertyValue('--bg').trim()
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', background))
    button?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
  }

  apply(readTheme())
  window.matchMedia(DARK_QUERY).addEventListener('change', (event) => {
    if (!storedTheme()) apply(event.matches ? 'dark' : 'light')
  })
  // A choice made in another tab, here or on the portfolio.
  window.addEventListener('storage', (event) => {
    if (event.key === THEME_KEY && (event.newValue === 'light' || event.newValue === 'dark')) apply(event.newValue)
  })

  button?.addEventListener('click', () => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    const run = () => {
      apply(next)
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // Storage blocked: the choice lasts for this visit.
      }
    }
    if (document.startViewTransition && !prefersReducedMotion()) document.startViewTransition(run)
    else run()
  })
}

/** The round button in the bottom right: shown once the title is out of sight, it scrolls back up. */
export function initBackToTop(): void {
  const button = document.querySelector<HTMLButtonElement>('.to-top')
  if (!button) return

  let queued = false
  const update = () => {
    queued = false
    button.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.9)
  }
  const queue = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(update)
  }
  window.addEventListener('scroll', queue, { passive: true })
  window.addEventListener('resize', queue)
  update()

  // Back to the top, and the keyboard focus with it.
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    const title = document.getElementById('title')
    if (title) {
      title.tabIndex = -1
      title.focus({ preventScroll: true })
    }
  })
}

/** `<button data-copy="#selector">` copies that element's text. */
export function initCopy(): void {
  const status = h('span', { class: 'visually-hidden', role: 'status', 'aria-live': 'polite' })
  document.body.append(status)

  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const target = document.querySelector<HTMLElement>(button.dataset.copy ?? '')
    const label = button.querySelector('.copy-label')
    if (!target) return
    let timer = 0

    button.addEventListener('click', async () => {
      const text = target.textContent ?? ''
      let copied = false
      try {
        await navigator.clipboard.writeText(text)
        copied = true
      } catch {
        // No clipboard access (an insecure origin, or permission refused): select the text instead.
        const selection = window.getSelection()
        selection?.selectAllChildren(target)
        copied = document.execCommand?.('copy') ?? false
      }
      button.classList.toggle('is-done', copied)
      if (label) label.textContent = copied ? 'Copied' : 'Selected'
      status.textContent = copied ? 'BibTeX copied to the clipboard' : 'BibTeX selected; press Ctrl+C or ⌘C to copy'
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        button.classList.remove('is-done')
        if (label) label.textContent = 'Copy'
      }, 2200)
    })
  })
}
