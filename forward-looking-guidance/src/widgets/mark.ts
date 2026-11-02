import { prefersReducedMotion, watchVisibility } from '../lib/motion'
import { motionPaused } from '../state'

/**
 * The mark beside the title: a tiny pixel display in which the operation that
 * is running shines a beam over the operations still ahead. That beam is
 * forward-looking guidance. It is drawn the pixel-art way, after pixelfx
 * (github.com/patch-gg/pixelfx, MIT): a low-resolution frame, light
 * posterized into bands from a hot core to a dithered edge, motes that light
 * up inside the beam, stepped at 12 fps and scaled up by whole pixels.
 */

export const COLS = 40
export const ROWS = 16
const MID = 8
const NODES = [5, 15, 25, 35]
const STEP = 2.2 // seconds each operation runs
const HOP = 0.32 // the light travelling to the next operation
const END = 1.4 // the finished plan, before the loop starts again
const CYCLE = NODES.length * STEP + END
const FPS = 12

type RGB = readonly [number, number, number]
// Dark to bright, hue-shifted: shadows lean deep teal, highlights lean warm mint.
const BG: RGB = [6, 17, 14]
const DOT: RGB = [13, 33, 27]
const RAMP: RGB[] = [
  [12, 58, 45],
  [16, 104, 78],
  [35, 170, 122],
  [118, 228, 180],
  [222, 255, 240],
]
const TRACK: RGB = [28, 58, 49]
const TRACK_DONE: RGB = [86, 116, 106]
const DONE: RGB = [150, 178, 168]
const AHEAD: RGB = [34, 118, 90]
const WHITE: RGB = [246, 255, 251]

// 4×4 ordered (Bayer) thresholds: a pixel at strength a is drawn when a is above its cell's threshold.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)
// Fine strands through the beam: a fixed brightness per row.
const STRANDS = Array.from({ length: ROWS }, (_, y) => 0.86 + 0.24 * Math.abs(Math.sin(y * 2.17 + 0.6)))

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))
const ease = (v: number) => 1 - (1 - v) ** 3

class Frame {
  readonly data: Uint8ClampedArray
  constructor(data: Uint8ClampedArray) {
    this.data = data
  }
  set(x: number, y: number, c: RGB): void {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return
    const i = (y * COLS + x) * 4
    this.data[i] = c[0]
    this.data[i + 1] = c[1]
    this.data[i + 2] = c[2]
    this.data[i + 3] = 255
  }
  /** Additive light on top of what is there. */
  add(x: number, y: number, c: RGB, k: number): void {
    if (k <= 0.01 || x < 0 || y < 0 || x >= COLS || y >= ROWS) return
    const i = (y * COLS + x) * 4
    for (let j = 0; j < 3; j++) this.data[i + j] = Math.min(255, this.data[i + j] + c[j] * k)
  }
}

/** Strength of the beam from an operation at x0 at a pixel, 0 outside it. */
function beamAt(x: number, y: number, x0: number, local: number, k: number): number {
  const d = x - x0
  if (d < 0) return 0
  const half = 0.6 + d * 0.22
  const q = (y - MID) / (half + 0.5)
  if (q <= -1 || q >= 1) return 0
  const profile = (1 - q * q) ** 1.5
  const fall = clamp(1.12 - d / 36)
  // A brighter band runs outward along the beam: looking ahead, again and again.
  const wave = Math.max(0, Math.cos(2 * Math.PI * (d / 15 - local * 0.85))) ** 3
  return profile * fall * STRANDS[y] * (0.78 + 0.42 * wave) * k
}

function render(f: Frame, t: number, boost: number): void {
  // Dark display with a faint dot grid.
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) f.set(x, y, x % 4 === 2 && y % 4 === 2 ? DOT : BG)

  const tc = ((t % CYCLE) + CYCLE) % CYCLE
  const finished = tc >= NODES.length * STEP
  const c = finished ? NODES.length : Math.floor(tc / STEP)
  const local = finished ? tc - NODES.length * STEP : tc - c * STEP
  const hopping = !finished && c < NODES.length - 1 && local > STEP - HOP
  const hop = hopping ? ease((local - (STEP - HOP)) / HOP) : 0

  // The track: solid where the plan has run, dotted ahead.
  const ranTo = finished ? NODES[NODES.length - 1] : NODES[Math.min(c, NODES.length - 1)]
  for (let x = NODES[0]; x <= NODES[NODES.length - 1]; x++) {
    if (x <= ranTo) f.set(x, MID, TRACK_DONE)
    else if (x % 2 === 0) f.set(x, MID, TRACK)
  }

  // The beam, posterized from a hot core to a dithered edge.
  // The last operation has nothing left to look ahead to (its G is empty): no beam.
  let k = 0
  if (!finished && c < NODES.length - 1) {
    const on = clamp(local / 0.35)
    const off = hopping ? 1 - hop : 1
    k = ease(on) * off * boost
  }
  const x0 = finished ? COLS : NODES[c] + 2
  if (k > 0) {
    for (let y = 1; y < ROWS - 1; y++) {
      for (let x = x0; x < COLS; x++) {
        const e = beamAt(x, y, x0, local, k)
        if (e < 0.06) continue
        if (e < 0.22) {
          if (e / 0.22 > BAYER[((y & 3) << 2) | (x & 3)]) f.set(x, y, RAMP[0])
          continue
        }
        f.set(x, y, RAMP[e > 0.92 ? 4 : e > 0.68 ? 3 : e > 0.44 ? 2 : 1])
      }
    }
    // Motes drift forward and catch the light inside the beam.
    for (let i = 0; i < 7; i++) {
      const span = COLS - x0
      if (span <= 1) break
      const mx = x0 + Math.floor((t * (6 + i * 1.7) + i * 7.3) % span)
      const my = Math.round(MID + Math.sin(t * (0.9 + i * 0.23) + i * 1.9) * (1 + (mx - x0) * 0.2))
      const e = beamAt(mx, my, x0, local, k)
      if (e > 0.18) f.set(mx, my, e > 0.6 ? WHITE : RAMP[3])
    }
  }

  // The operations.
  NODES.forEach((nx, i) => {
    const plus = (col: RGB) => {
      f.set(nx, MID, col)
      f.set(nx - 1, MID, col)
      f.set(nx + 1, MID, col)
      f.set(nx, MID - 1, col)
      f.set(nx, MID + 1, col)
    }
    if (i < c) {
      plus(DONE)
    } else if (i === c && !finished) {
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) f.set(nx + dx, MID + dy, WHITE)
    } else {
      // Ahead: a dark ring that the beam lights up, brightest when the scan passes over it.
      const e = k > 0 ? beamAt(nx, MID, x0, local, k) : 0
      const ring = e > 0.7 ? RAMP[4] : e > 0.4 ? RAMP[3] : e > 0.18 ? RAMP[2] : AHEAD
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) f.set(nx + dx, MID + dy, ring)
      f.set(nx, MID, e > 0.4 ? WHITE : BG)
    }
  })

  // Glow around the running operation, or the light hopping on to the next one.
  if (!finished) {
    const gx = hopping ? NODES[c] + (NODES[c + 1] - NODES[c]) * hop : NODES[c]
    const gk = (hopping ? 1 : 0.55 + 0.25 * Math.sin(local * 5)) * boost
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const r = Math.hypot(dx, dy)
        if (r > 3.2) continue
        f.add(Math.round(gx) + dx, MID + dy, RAMP[2], gk * (1 - r / 3.4) * 0.55)
      }
    }
    if (hopping) {
      const hx = Math.round(gx)
      for (let j = 0; j < 4; j++) f.set(hx - j, MID, j === 0 ? WHITE : RAMP[4 - j])
    }
  } else {
    // The plan is done: a brief sparkle on the last operation, then the loop starts again.
    const s = clamp(1 - local / 0.9)
    const nx = NODES[NODES.length - 1]
    if (s > 0) {
      for (let r = 1; r <= 3; r++) {
        const col = RAMP[Math.max(1, 4 - r)]
        if (s > r / 4) for (const [dx, dy] of [[r, 0], [-r, 0], [0, r], [0, -r]]) f.set(nx + dx, MID + dy, col)
      }
      f.set(nx, MID, WHITE)
    }
  }

  // Faint scanlines.
  for (let y = 1; y < ROWS; y += 2) {
    for (let x = 0; x < COLS; x++) {
      const i = (y * COLS + x) * 4
      f.data[i] *= 0.9
      f.data[i + 1] *= 0.9
      f.data[i + 2] *= 0.9
    }
  }
}

/** The moment shown with reduced motion (and in the link preview): the first operation lighting up all three ahead. */
export const STILL = 1

/** Paints the frame at `t` seconds into `data`, COLS × ROWS RGBA pixels. */
export function paintMark(data: Uint8ClampedArray, t: number, boost = 1): void {
  render(new Frame(data), t, boost)
}

export function mountMark(holder: HTMLElement): void {
  const canvas = document.createElement('canvas')
  canvas.width = COLS
  canvas.height = ROWS
  canvas.className = 'title-mark-canvas'
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  holder.replaceChildren(canvas)
  const image = ctx.createImageData(COLS, ROWS)
  const frame = new Frame(image.data)

  // Whole device pixels per frame pixel, so every pixel is the same size and edges stay crisp.
  const fit = () => {
    const size = parseFloat(getComputedStyle(holder).fontSize) || 48
    const dpr = window.devicePixelRatio || 1
    const cell = Math.max(1, Math.round((size * 0.86 * dpr) / ROWS))
    const w = (COLS * cell) / dpr
    const h = (ROWS * cell) / dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    canvas.style.borderRadius = `${(cell * 3) / dpr}px`
    // Centre it on the capitals beside it (Inter's caps stand about 0.73 em tall).
    holder.style.verticalAlign = `${size * 0.365 - h / 2}px`
  }
  fit()
  if (typeof ResizeObserver === 'function') new ResizeObserver(fit).observe(holder.parentElement ?? holder)
  window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`).addEventListener?.('change', fit)

  const draw = (t: number) => {
    render(frame, t, boost)
    ctx.putImageData(image, 0, 0)
  }

  // With reduced motion the display holds one moment.
  let boost = 1
  if (prefersReducedMotion()) {
    draw(STILL)
    return
  }

  let t = 0
  let last = 0
  let shown = -1
  let raf = 0
  let visible = false
  let target = 1
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop)
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
    last = now
    t += dt
    boost += (target - boost) * Math.min(1, dt * 6)
    const step = Math.floor(t * FPS)
    if (step === shown) return
    shown = step
    draw(step / FPS)
  }
  const sync = () => {
    cancelAnimationFrame(raf)
    last = 0
    if (visible && !document.hidden && !motionPaused.get()) raf = requestAnimationFrame(loop)
    else draw(Math.floor(t * FPS) / FPS)
  }

  // Hovering makes it look harder.
  holder.addEventListener('pointerenter', () => (target = 1.25))
  holder.addEventListener('pointerleave', () => (target = 1))
  watchVisibility(holder, (isVisible) => {
    visible = isVisible
    sync()
  })
  document.addEventListener('visibilitychange', sync)
  motionPaused.subscribe(sync)
  draw(0)
}
