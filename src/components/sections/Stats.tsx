import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Stats.module.css'

interface StatItem {
  label: string
  value: number
  suffix?: string
  caption: string
  accent: string
}

const ITEMS: StatItem[] = [
  { label: 'Years of Research', value: 2, suffix: '+', caption: 'JBNU · M.S. → Ph.D', accent: '#fbbf24' },
  { label: 'Publication', value: 1, suffix: '', caption: 'NTCIR-18 HIDDEN-RAD', accent: '#ec4899' },
  { label: 'Mentored TA Hours', value: 6, suffix: ' mo', caption: 'Teaching Assistant 2025', accent: '#8b5cf6' },
  { label: 'Defense Service', value: 23, suffix: ' mo', caption: 'ROK Air Force · Patriot', accent: '#06b6d4' },
  { label: 'Korea Pride', value: 100, suffix: '%', caption: '🇰🇷 native Jeonju', accent: '#22c55e' },
  { label: 'Dreams', value: 999, suffix: '+', caption: 'AI expert in the making', accent: '#fb7185' },
]

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>// stats · the resume in numbers</span>
          <h2 className={styles.title}>
            By the <span className={styles.highlight}>numbers</span>.
          </h2>
        </div>

        <div className={styles.grid}>
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              className={styles.card}
              style={{ ['--tint' as string]: item.accent } as React.CSSProperties}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.cardGlow} aria-hidden />
              <div className={styles.label}>{item.label}</div>
              <div className={styles.value}>
                <Counter target={item.value} active={inView} delay={i * 0.07 + 0.2} />
                <span className={styles.suffix}>{item.suffix}</span>
              </div>
              <div className={styles.caption}>{item.caption}</div>
              <div className={styles.barTrack}>
                <motion.div
                  className={styles.bar}
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: i * 0.07 + 0.3, duration: 1.1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Counter({ target, active, delay }: { target: number; active: boolean; delay: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const duration = 1200
    const start = performance.now() + delay * 1000
    const step = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / duration))
      const eased = 1 - Math.pow(1 - t, 3)
      setV(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, delay, target])
  return <>{v.toLocaleString()}</>
}
