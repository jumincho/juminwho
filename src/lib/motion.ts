/** The query behind every motion guard; the CSS uses the same one. */
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches

let running: ViewTransition | null = null

/**
 * Runs `update`, a synchronous change to the page, as a view transition. While
 * it plays, `<html data-transition>` names it, so global.css can style it.
 * Without support, or when the visitor prefers reduced motion, the change
 * simply happens and this returns null.
 */
export function withViewTransition(name: string, update: () => void): ViewTransition | null {
  if (!('startViewTransition' in document) || prefersReducedMotion()) {
    update()
    return null
  }
  const root = document.documentElement
  root.dataset.transition = name
  const transition = document.startViewTransition(update)
  running = transition
  const done = () => {
    if (running !== transition) return
    running = null
    delete root.dataset.transition
  }
  transition.finished.then(done, done)
  return transition
}
