import { useEffect, useRef } from 'react'

/**
 * SakuraPetals — a canvas of cherry-blossom petals drifting down the page.
 *
 * Each petal falls, sways on a sine breeze, and flutters in faux-3D (its
 * horizontal scale rides a cosine so it appears to flip edge-on). Built to be
 * a good citizen like the shader: caps device-pixel-ratio, pauses when
 * off-screen or tab-hidden, scatters a single still frame for reduced-motion
 * users, and recycles a fixed pool of petals so it never allocates per frame.
 */

type Petal = {
  x: number
  y: number
  z: number // depth 0..1 (1 = closest → bigger, faster, more opaque)
  size: number
  sway: number // horizontal sway amplitude
  swaySpeed: number
  phase: number
  drift: number // steady sideways drift
  spin: number // current rotation
  spinSpeed: number
  flip: number // faux-3D flutter angle
  flipSpeed: number
  hue: [string, string] // gradient stops
}

const TINTS: Array<[string, string]> = [
  ['#ffe3ee', '#ffb6d2'], // pale → sakura
  ['#fff0f5', '#ffc1da'], // blush
  ['#ffd9e6', '#ff9ec4'], // deeper rose
  ['#ffe8df', '#ffc0a8'], // peachy
  ['#fbe8ff', '#e3b8ff'], // wisteria hint
]

export default function SakuraPetals({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let raf = 0
    let running = true
    let last = performance.now()

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    let petals: Petal[] = []
    const spawn = (atTop: boolean): Petal => {
      const z = Math.random()
      return {
        x: rand(-40, w + 40),
        y: atTop ? rand(-h * 0.3, -20) : rand(-20, h),
        z,
        size: rand(9, 17) * (0.7 + z * 0.7),
        sway: rand(18, 52) * (0.6 + z),
        swaySpeed: rand(0.4, 1.0),
        phase: rand(0, Math.PI * 2),
        drift: rand(-0.25, 0.25) - 0.12,
        spin: rand(0, Math.PI * 2),
        spinSpeed: rand(-0.012, 0.012),
        flip: rand(0, Math.PI * 2),
        flipSpeed: rand(0.01, 0.03),
        hue: TINTS[(Math.random() * TINTS.length) | 0],
      }
    }

    const build = () => {
      // density scales with area, gently — never a blizzard
      const target = Math.round(Math.min(64, Math.max(22, (w * h) / 26000)))
      petals = Array.from({ length: target }, () => spawn(false))
    }

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!petals.length) build()
    }
    resize()
    window.addEventListener('resize', resize)

    const drawPetal = (pt: Petal) => {
      const s = pt.size
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.rotate(pt.spin)
      ctx.scale(Math.cos(pt.flip) * 0.85 + 0.15, 1) // faux-3D flutter
      ctx.globalAlpha = 0.45 + pt.z * 0.5
      const grad = ctx.createLinearGradient(0, -s, 0, s)
      grad.addColorStop(0, pt.hue[0])
      grad.addColorStop(1, pt.hue[1])
      ctx.fillStyle = grad
      // petal: rounded lobe with a soft notch at the wide (top) end
      ctx.beginPath()
      ctx.moveTo(0, s)
      ctx.bezierCurveTo(s * 0.62, s * 0.5, s * 0.6, -s * 0.55, 0, -s)
      ctx.bezierCurveTo(s * 0.16, -s * 0.7, -s * 0.16, -s * 0.7, 0, -s * 0.74) // top notch
      ctx.bezierCurveTo(-s * 0.6, -s * 0.55, -s * 0.62, s * 0.5, 0, s)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const step = (now: number) => {
      if (!running) return
      const dt = Math.min(2.5, (now - last) / 16.67) // frames elapsed, clamped
      last = now
      ctx.clearRect(0, 0, w, h)
      for (const pt of petals) {
        pt.y += (0.35 + pt.z * 1.1) * dt
        pt.phase += pt.swaySpeed * 0.02 * dt
        pt.x += (Math.sin(pt.phase) * pt.sway * 0.012 + pt.drift) * dt
        pt.spin += pt.spinSpeed * dt
        pt.flip += pt.flipSpeed * dt
        if (pt.y - pt.size > h || pt.x < -60 || pt.x > w + 60) {
          Object.assign(pt, spawn(true))
        }
        drawPetal(pt)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(step)
    }

    const loop = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(step)
    }
    const drawStill = () => {
      ctx.clearRect(0, 0, w, h)
      for (const pt of petals) drawPetal(pt)
      ctx.globalAlpha = 1
    }

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !document.hidden
      if (running && !reduce) loop()
    })
    io.observe(canvas)
    const onVis = () => {
      running = !document.hidden
      if (running && !reduce) loop()
    }
    document.addEventListener('visibilitychange', onVis)

    if (reduce) drawStill()
    else loop()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none', zIndex: 1 }}
    />
  )
}
