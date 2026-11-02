import { onFirstView, prefersReducedMotion } from '../lib/motion'

/**
 * The flight on the postcard's map. The first time the card is seen, the pen
 * line draws itself from Seoul toward Rome with the plane at its tip, and the
 * plane comes to rest just short of Rome, about to land. With reduced motion
 * it is already there.
 */

const DURATION = 3400
const LANDED = 0.94 // how far along the route the plane stops

const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - (-2 * v + 2) ** 2 / 2)

export function mountRoute(map: HTMLElement): void {
  const line = map.querySelector<SVGPathElement>('.pc-route-line')
  const reveal = map.querySelector<SVGPathElement>('.pc-route-reveal')
  const plane = map.querySelector<SVGPathElement>('.pc-plane')
  if (!line || !reveal || !plane) return
  const length = line.getTotalLength()

  const place = (p: number) => {
    reveal.style.strokeDashoffset = String(1 - p)
    const at = line.getPointAtLength(length * p)
    const ahead = line.getPointAtLength(Math.min(length, length * p + 0.5))
    const behind = line.getPointAtLength(Math.max(0, length * p - 0.5))
    const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI
    plane.setAttribute('transform', `translate(${at.x.toFixed(2)} ${at.y.toFixed(2)}) rotate(${angle.toFixed(1)})`)
  }

  if (prefersReducedMotion()) {
    place(LANDED)
    return
  }
  place(0)
  onFirstView(
    map,
    () => {
      const start = performance.now()
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / DURATION)
        place(LANDED * ease(k))
        if (k < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    },
    0.6,
  )
}
