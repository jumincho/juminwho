import { s } from '../lib/dom'
import { prefersReducedMotion, watchVisibility } from '../lib/motion'
import { motionPaused } from '../state'

/**
 * The mark beside the title: the view through a pair of binoculars, down a
 * path that runs to a glow on the horizon. The operations still ahead wait
 * along it, smaller the further off they are, and a slow focus travels from
 * the nearest to the horizon, then starts again: forward-looking guidance,
 * seeing what remains of the plan. The view sways a little, as binoculars do
 * in the hand. It quickens while hovered, pauses with the hero's pause
 * button, off screen and in hidden tabs, and holds still with reduced motion.
 */

const HORIZON = 30
const NEAR = 2
const FAR = 26
const SPAN = 72 // screen y = HORIZON + SPAN / depth
const DEPTHS = [3, 5, 8.5, 14.5] // the operations ahead, nearest first
const SWEEP = 2.8 // seconds for the focus to reach the horizon
const REST = 1.8 // and a pause before it looks again
const PERIOD = SWEEP + REST

const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - (-2 * v + 2) ** 3 / 2)

/**
 * Where the path is at a depth: its centre on screen and its half-width. It
 * comes in at the bottom of the left lens and sweeps forward, to the right,
 * into the distance of the right lens, clear of the notch between the lenses.
 */
export function roadAt(depth: number): { x: number; y: number; half: number } {
  return { x: 82 - 48 * (NEAR / depth) ** 0.8, y: HORIZON + SPAN / depth, half: 30 / depth }
}

/** The path as a filled shape: the near edge, out to the horizon and back. */
export function roadPath(): string {
  const depths = [1.8, 2.2, 2.7, 3.3, 4, 5, 6.2, 7.8, 9.8, 12.4, 15.6, 19.5, 23, FAR]
  const left = depths.map((d) => roadAt(d)).map((r) => [r.x - r.half, r.y])
  const right = depths.map((d) => roadAt(d)).map((r) => [r.x + r.half, r.y]).reverse()
  return `M${[...left, ...right].map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z`
}

/** Where the path meets the horizon. */
export const VANISH = roadAt(FAR)

export interface Dot {
  cx: number
  cy: number
  r: number
  opacity: number
  halo: number
}

/** The operations, the glow on the horizon and the sway of the view at t seconds. */
export function sceneAt(t: number): { dots: Dot[]; glow: number; sway: [number, number] } {
  const phase = (t % PERIOD) / SWEEP
  const focus = phase <= 1 ? ease(phase) : -1 // 0 at the nearest operation, 1 at the horizon
  const lit = (at: number, width: number) => (focus < 0 ? 0 : Math.exp(-(((focus - at) / width) ** 2)))
  const dots = DEPTHS.map((depth, k) => {
    const { x, y } = roadAt(depth)
    const b = lit(k / DEPTHS.length, 0.13)
    const far = (NEAR / depth) ** 0.3
    return {
      cx: x,
      cy: y,
      r: (3.3 * (NEAR / depth) ** 0.62 + 0.4) * (1 + 0.22 * b),
      opacity: (0.55 + 0.45 * b) * (0.62 + 0.38 * far),
      halo: b,
    }
  })
  return { dots, glow: 0.45 + 0.55 * lit(1, 0.16), sway: [0.7 * Math.sin(t * 0.8), 0.4 * Math.sin(t * 1.15 + 1)] }
}

/** The moment shown with reduced motion and in the link preview: the focus on the second operation. */
export const STILL = SWEEP * 0.42

export function mountMark(holder: HTMLElement): void {
  const svg = holder.querySelector('svg')
  const scene = svg?.querySelector<SVGGElement>('.bino-scene')
  const glow = svg?.querySelector<SVGCircleElement>('.bino-glow')
  const road = svg?.querySelector<SVGPathElement>('.bino-road')
  const group = svg?.querySelector<SVGGElement>('.bino-nodes')
  if (!svg || !scene || !glow || !road || !group) return

  road.setAttribute('d', roadPath())
  glow.setAttribute('cx', VANISH.x.toFixed(2))
  glow.setAttribute('cy', (VANISH.y - 1.4).toFixed(2))
  const nodes = DEPTHS.map(() => {
    const halo = s('circle', { class: 'bino-halo' })
    const dot = s('circle', { class: 'bino-dot' })
    group.append(s('g', { class: 'bino-node' }, halo, dot))
    return { halo, dot }
  })

  const draw = (t: number, sway = true) => {
    const { dots, glow: g, sway: [dx, dy] } = sceneAt(t)
    dots.forEach((d, k) => {
      const { halo, dot } = nodes[k]
      dot.setAttribute('cx', d.cx.toFixed(2))
      dot.setAttribute('cy', d.cy.toFixed(2))
      dot.setAttribute('r', d.r.toFixed(2))
      dot.setAttribute('opacity', d.opacity.toFixed(3))
      halo.setAttribute('cx', d.cx.toFixed(2))
      halo.setAttribute('cy', d.cy.toFixed(2))
      halo.setAttribute('r', (d.r * 2.8).toFixed(2))
      halo.setAttribute('opacity', (0.3 * d.halo).toFixed(3))
    })
    glow.setAttribute('opacity', g.toFixed(3))
    scene.setAttribute('transform', sway ? `translate(${dx.toFixed(2)} ${dy.toFixed(2)})` : '')
  }

  if (prefersReducedMotion()) {
    draw(STILL, false)
    return
  }

  let t = STILL
  let last = 0
  let raf = 0
  let visible = false
  let speed = 1
  let target = 1
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop)
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
    last = now
    speed += (target - speed) * Math.min(1, dt * 4)
    t += dt * speed
    draw(t)
  }
  const sync = () => {
    cancelAnimationFrame(raf)
    last = 0
    if (visible && !document.hidden && !motionPaused.get()) raf = requestAnimationFrame(loop)
  }

  // Hovering looks harder: the focus sweeps faster.
  holder.addEventListener('pointerenter', () => (target = 2.2))
  holder.addEventListener('pointerleave', () => (target = 1))
  watchVisibility(holder, (isVisible) => {
    visible = isVisible
    sync()
  })
  document.addEventListener('visibilitychange', sync)
  motionPaused.subscribe(sync)
  draw(t)
}
