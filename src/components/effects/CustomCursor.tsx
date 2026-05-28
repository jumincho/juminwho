import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0
    let hovering = false

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null
      const target = t?.closest?.('a, button, [data-magnetic], [role="button"]')
      hovering = !!target
      ring.classList.toggle(styles.hover, hovering)
    }

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    document.documentElement.classList.add('has-custom-cursor')
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className={styles.ring} aria-hidden />
      <div ref={dotRef} className={styles.dot} aria-hidden />
    </>
  )
}
