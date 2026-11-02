import { h } from '../lib/dom'
import { prefersReducedMotion } from '../lib/motion'

/**
 * The page around the figures: theme, top bar, reading progress, the table of
 * contents with its scrollspy, reveal-on-scroll and the BibTeX copy button.
 */

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

/** Sections the table of contents and the top navigation point at, in page order. */
const TOC_SECTIONS = ['top', 'problem', 'method', 'experiments', 'results', 'analysis', 'related', 'cite', 'thanks']
/** Which top-bar link stands for a section (setup and results are one chapter in the paper). */
const NAV_FOR: Record<string, string> = {
  problem: 'problem',
  method: 'method',
  experiments: 'results',
  results: 'results',
  analysis: 'analysis',
  cite: 'cite',
}

export function initScroll(): void {
  const topbar = document.querySelector<HTMLElement>('.topbar')
  const progress = document.querySelector<HTMLElement>('.progress span')
  const toc = document.querySelector<HTMLElement>('.toc')
  const title = document.getElementById('title')
  const sections = TOC_SECTIONS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
  const tocLinks = new Map([...document.querySelectorAll<HTMLAnchorElement>('.toc a')].map((a) => [a.hash.slice(1), a]))
  const navLinks = new Map([...document.querySelectorAll<HTMLAnchorElement>('.topnav a')].map((a) => [a.hash.slice(1), a]))

  let current = ''
  const markCurrent = (id: string) => {
    if (id === current) return
    current = id
    for (const [key, link] of tocLinks) {
      if (key === id) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
    for (const [key, link] of navLinks) {
      if (key === NAV_FOR[id]) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
  }

  let queued = false
  const update = () => {
    queued = false
    // Read everything first, then write, so the scroll handler never forces a second layout.
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    const line = window.innerHeight * 0.32
    let id = sections[0]?.id ?? ''
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) id = section.id
    }
    // At the very bottom the last section may never reach the line; it is the one being read.
    if (max > 0 && y >= max - 2) id = sections[sections.length - 1]?.id ?? id

    topbar?.classList.toggle('is-scrolled', y > 4)
    progress?.style.setProperty('--progress', String(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0))
    markCurrent(id)
  }
  const queue = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(update)
  }
  window.addEventListener('scroll', queue, { passive: true })
  window.addEventListener('resize', queue)
  update()

  // The wordmark and the table of contents appear once the title has scrolled away.
  if (title && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting && entry.boundingClientRect.top < 0
      topbar?.classList.toggle('is-past-title', past)
      toc?.classList.toggle('is-visible', past)
    }).observe(title)
  }
}

/**
 * Fades blocks in the first time they scroll into view. The inline script in
 * index.html hides them before first paint; `fx-ready` tells the stylesheet
 * this module is running, and without it a failsafe animation shows them anyway.
 */
export function initReveal(): void {
  const items = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
  document.documentElement.classList.add('fx-ready')
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'))
    return
  }
  document.querySelectorAll<HTMLElement>('.hero [data-reveal]').forEach((el, index) => {
    el.style.transitionDelay = `${index * 70}ms`
  })
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  )
  items.forEach((el) => observer.observe(el))
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

/**
 * The letter's share button: the system share sheet where there is one
 * (phones, mostly), otherwise a button that copies the page's link.
 */
export function initShare(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-share]')
  const label = button?.querySelector('.share-label')
  if (!button || !label) return
  const url = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? location.href
  const native = typeof navigator.share === 'function'
  label.textContent = native ? 'Share this page' : 'Copy link'
  label.setAttribute('aria-live', 'polite')
  button.hidden = false

  let timer = 0
  button.addEventListener('click', async () => {
    if (native) {
      try {
        await navigator.share({ title: document.title, url })
      } catch {
        // Dismissed: nothing to do.
      }
      return
    }
    let copied = false
    try {
      await navigator.clipboard.writeText(url)
      copied = true
    } catch {
      copied = false
    }
    label.textContent = copied ? 'Link copied' : url
    button.classList.toggle('is-done', copied)
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      label.textContent = 'Copy link'
      button.classList.remove('is-done')
    }, 2200)
  })
}
