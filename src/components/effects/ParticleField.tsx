import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  hue: number
}

interface Props {
  density?: number
  className?: string
}

export default function ParticleField({ density = 80, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight
    let raf = 0
    let particles: Particle[] = []
    const mouse = { x: width / 2, y: height / 2, active: false }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function spawn() {
      const target = reducedMotion ? Math.floor(density / 3) : density
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        hue: 38 + Math.random() * 30,
      }))
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            const f = (140 - dist) / 140
            p.x += (dx / (dist || 1)) * f * 1.6
            p.y += (dy / (dist || 1)) * f * 1.6
          }
        }

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`
        ctx!.shadowColor = `hsla(${p.hue}, 90%, 65%, ${p.alpha * 0.8})`
        ctx!.shadowBlur = p.size * 6
        ctx!.fill()
      }

      // connect close points
      ctx!.shadowBlur = 0
      const maxDist = 110
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < maxDist * maxDist) {
            const d = Math.sqrt(d2)
            const opacity = (1 - d / maxDist) * 0.18
            ctx!.strokeStyle = `rgba(251, 191, 36, ${opacity})`
            ctx!.lineWidth = 0.6
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      raf = requestAnimationFrame(tick)
    }

    function onMove(e: PointerEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    function onLeave() {
      mouse.active = false
    }

    resize()
    spawn()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden
    />
  )
}
