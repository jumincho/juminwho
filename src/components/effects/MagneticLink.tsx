import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  strength?: number
  inline?: boolean
  style?: CSSProperties
}

export default function MagneticLink({
  children,
  className,
  strength = 0.35,
  inline,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.5 })
  const innerX = useTransform(sx, (v) => v * 0.55)
  const innerY = useTransform(sy, (v) => v * 0.55)

  function handleMove(e: React.PointerEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * strength)
    y.set(dy * strength)
  }
  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{
        x: sx,
        y: sy,
        display: inline ? 'inline-flex' : 'inline-flex',
        position: 'relative',
        ...style,
      }}
      data-magnetic
    >
      <motion.span
        style={{ x: innerX, y: innerY, display: 'inline-flex', width: '100%' }}
      >
        {children}
      </motion.span>
    </motion.div>
  )
}
