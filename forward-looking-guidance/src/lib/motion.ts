const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches

/** Calls `callback` once, the first time `el` scrolls into view (at once without IntersectionObserver). */
export function onFirstView(el: Element, callback: () => void, threshold = 0.35): void {
  if (!('IntersectionObserver' in window)) {
    callback()
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect()
        callback()
      }
    },
    { threshold },
  )
  observer.observe(el)
}

/** Calls `callback(true|false)` whenever `el` enters or leaves the viewport. Returns a stop function. */
export function watchVisibility(el: Element, callback: (visible: boolean) => void): () => void {
  if (!('IntersectionObserver' in window)) {
    callback(true)
    return () => {}
  }
  const observer = new IntersectionObserver((entries) => callback(entries.some((entry) => entry.isIntersecting)))
  observer.observe(el)
  return () => observer.disconnect()
}
