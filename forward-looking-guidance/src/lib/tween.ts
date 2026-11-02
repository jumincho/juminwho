import { prefersReducedMotion } from './motion'

const easeOut = (t: number) => 1 - (1 - t) ** 3

const running = new WeakMap<Element, number>()

/**
 * Moves numeric SVG attributes of `el` to `to` over `duration` ms. CSS cannot
 * transition geometry attributes in every browser, so this does it by hand;
 * with reduced motion the values are set at once.
 */
export function tween(el: Element, to: Record<string, number>, duration = 520): void {
  cancelAnimationFrame(running.get(el) ?? 0)
  const from: Record<string, number> = {}
  for (const name of Object.keys(to)) from[name] = Number.parseFloat(el.getAttribute(name) ?? '') || 0
  if (prefersReducedMotion() || duration <= 0) {
    for (const [name, value] of Object.entries(to)) el.setAttribute(name, String(value))
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const k = easeOut(t)
    for (const [name, value] of Object.entries(to)) el.setAttribute(name, String(from[name] + (value - from[name]) * k))
    if (t < 1) running.set(el, requestAnimationFrame(step))
  }
  running.set(el, requestAnimationFrame(step))
}
