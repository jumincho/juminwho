import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './Cursor.module.css'

/** A blend-mode cursor: a quick dot and a lagging ring that swells over targets. */
export default function Cursor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return fine && !reduce
  })
  const [hot, setHot] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 })
  const dotX = useSpring(x, { stiffness: 900, damping: 40 })
  const dotY = useSpring(y, { stiffness: 900, damping: 40 })

  useEffect(() => {
    if (!enabled) return

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as Element | null
      setHot(Boolean(t?.closest('a, button, [data-cursor], input, textarea')))
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.body.classList.add(styles.hideNative)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.body.classList.remove(styles.hideNative)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden
        className={`${styles.ring} ${hot ? styles.ringHot : ''} ${down ? styles.ringDown : ''}`}
        style={{ x: ringX, y: ringY }}
      />
      <motion.div aria-hidden className={styles.dot} style={{ x: dotX, y: dotY }} />
    </>
  )
}
