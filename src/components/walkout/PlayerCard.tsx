import { useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { JBNUShield, KoreanFlag } from './symbols'
import styles from './PlayerCard.module.css'

interface Props {
  reveal?: boolean
}

const STATS = [
  { label: 'NLP', value: 99 },
  { label: 'RAG', value: 95 },
  { label: 'LLM', value: 93 },
  { label: 'RES', value: 90 },
  { label: 'DEV', value: 88 },
  { label: 'DRM', value: 99 },
] as const

export default function PlayerCard({ reveal = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useSpring(0, { stiffness: 200, damping: 18, mass: 0.6 })
  const ry = useSpring(0, { stiffness: 200, damping: 18, mass: 0.6 })
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!reveal) return
    const t = window.setTimeout(() => setRevealed(true), 80)
    return () => window.clearTimeout(t)
  }, [reveal])

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rx.set((py - 0.5) * -18)
    ry.set((px - 0.5) * 18)
    mx.set(px * 100)
    my.set(py * 100)
  }

  function handleLeave() {
    rx.set(0)
    ry.set(0)
    mx.set(50)
    my.set(50)
  }

  const transform = useMotionTemplate`perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`
  const shineGradient = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 45%)`
  const holoGradient = useMotionTemplate`
    conic-gradient(from ${mx}deg at ${mx}% ${my}%,
      rgba(251,191,36,0.6),
      rgba(236,72,153,0.55),
      rgba(139,92,246,0.55),
      rgba(6,182,212,0.55),
      rgba(34,197,94,0.55),
      rgba(251,191,36,0.6)
    )
  `

  return (
    <motion.div
      ref={ref}
      className={styles.tilt}
      style={{ transform }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handleLeave}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.halo} aria-hidden />
      <div className={styles.foil}>
        <div className={styles.inner}>
          <motion.div className={styles.holo} style={{ background: holoGradient }} aria-hidden />
          <motion.div className={styles.shine} style={{ background: shineGradient }} aria-hidden />

          <div className={styles.topLeft}>
            <span className={styles.rating}>99</span>
            <span className={styles.position}>PHD</span>
            <div className={styles.smallFlag}>
              <KoreanFlag style={{ width: '100%', height: '100%' }} />
            </div>
            <div className={styles.smallShield}>
              <JBNUShield style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          <div className={styles.portrait}>
            <div className={styles.portraitRing} aria-hidden />
            <img
              src={`${import.meta.env.BASE_URL}jumin-cho.jpg`}
              alt="Jumin Cho"
              className={styles.portraitImg}
            />
            <div className={styles.portraitGloss} aria-hidden />
          </div>

          <div className={styles.name}>JUMIN CHO</div>
          <div className={styles.subname}>조주민 · 趙朱旼</div>
          <div className={styles.divider} />

          <div className={styles.stats}>
            {STATS.map(({ label, value }, i) => (
              <CountStat key={label} label={label} value={value} delay={0.6 + i * 0.08} active={revealed} />
            ))}
          </div>

          <div className={styles.club}>
            <span>JEONBUK NATIONAL UNIVERSITY</span>
            <span className={styles.dot}>·</span>
            <span>NLLLab</span>
          </div>

          <div className={styles.cornerTL} aria-hidden />
          <div className={styles.cornerTR} aria-hidden />
          <div className={styles.cornerBL} aria-hidden />
          <div className={styles.cornerBR} aria-hidden />
        </div>
      </div>
    </motion.div>
  )
}

function CountStat({ label, value, delay, active }: { label: string; value: number; delay: number; active: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return
    let frame = 0
    const duration = 900
    const start = performance.now() + delay * 1000
    let raf = 0
    function tick(now: number) {
      const t = Math.max(0, Math.min(1, (now - start) / duration))
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * value))
      frame += 1
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, delay, value])

  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{display}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}
