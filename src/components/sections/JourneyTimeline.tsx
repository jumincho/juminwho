import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './JourneyTimeline.module.css'

interface Item {
  year: string
  role: string
  org: string
  detail: string
  tint: string
  emoji: string
}

const ITEMS: Item[] = [
  {
    year: '2018',
    role: 'B.S. Begins',
    org: 'Computer Science · JBNU',
    detail: 'Entered Jeonbuk National University, set sights on AI.',
    tint: '#22c55e',
    emoji: '🎓',
  },
  {
    year: '2019',
    role: 'ROK Air Force',
    org: 'Air Defense Artillery · Patriot',
    detail: 'Sergeant & squad leader, 23 months operating the Patriot system.',
    tint: '#0ea5e9',
    emoji: '🛡️',
  },
  {
    year: '2020',
    role: 'Vice Student Council President',
    org: 'Department of Computer Science',
    detail: 'Led department-level student initiatives for a year.',
    tint: '#a855f7',
    emoji: '🎤',
  },
  {
    year: '2024',
    role: 'B.S. → M.S.',
    org: 'JBNU CS · NLLLab',
    detail: 'Bachelor’s done. Joined Prof. Seung-Hoon Na’s lab as a researcher and RA.',
    tint: '#fbbf24',
    emoji: '🧠',
  },
  {
    year: '2025',
    role: 'Teaching Assistant',
    org: 'Department of Computer Science',
    detail: 'Mentored undergrads through six months of TA duties.',
    tint: '#f97316',
    emoji: '📚',
  },
  {
    year: '2026',
    role: 'M.S. → Ph.D',
    org: 'NLLLab · JBNU',
    detail: 'M.S. completed. Ph.D. begins under Prof. Hyun-Je Song.',
    tint: '#ec4899',
    emoji: '🚀',
  },
  {
    year: '2029',
    role: 'Ph.D Target',
    org: 'Future me',
    detail: 'Dissertation defended. Causality-aware reasoning in production.',
    tint: '#8b5cf6',
    emoji: '✨',
  },
]

export default function JourneyTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const lineH = useTransform(scrollYProgress, [0, 0.85], ['0%', '100%'])

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>// journey · the long form</span>
          <h2 className={styles.title}>
            From <span className={styles.italic}>Jeonju</span> with code,&nbsp;
            <br />
            one chapter at a time.
          </h2>
        </div>

        <div className={styles.rail}>
          <div className={styles.line} aria-hidden>
            <motion.div className={styles.lineFill} style={{ height: lineH }} />
          </div>
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.year + item.role}
              className={`${styles.row} ${i % 2 === 0 ? styles.left : styles.right}`}
              style={{ ['--tint' as string]: item.tint } as React.CSSProperties}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.year}>{item.year}</div>
              <div className={styles.node}>
                <div className={styles.nodeRing} aria-hidden />
                <span className={styles.nodeEmoji}>{item.emoji}</span>
              </div>
              <div className={styles.card}>
                <div className={styles.cardGlow} aria-hidden />
                <div className={styles.cardRole}>{item.role}</div>
                <div className={styles.cardOrg}>{item.org}</div>
                <div className={styles.cardDetail}>{item.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
