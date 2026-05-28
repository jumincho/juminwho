import { useEffect, useRef } from 'react'
import styles from './AuroraBackground.module.css'

export default function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let tx = 50
    let ty = 50
    let cx = 50
    let cy = 50
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 100
      ty = (e.clientY / window.innerHeight) * 100
    }
    const tick = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.setProperty('--mx', `${cx}%`)
      el.style.setProperty('--my', `${cy}%`)
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className={styles.aurora} aria-hidden>
      <div className={styles.blob} style={{ ['--c1' as string]: '#fbbf24', ['--c2' as string]: '#f97316' }} />
      <div className={styles.blob} style={{ ['--c1' as string]: '#8b5cf6', ['--c2' as string]: '#ec4899' }} />
      <div className={styles.blob} style={{ ['--c1' as string]: '#06b6d4', ['--c2' as string]: '#3b82f6' }} />
      <div className={styles.cursor} />
      <div className={styles.grid} />
      <div className={styles.noise} />
    </div>
  )
}
