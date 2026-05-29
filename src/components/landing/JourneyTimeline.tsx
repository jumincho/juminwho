import { motion } from 'framer-motion'
import { education, experience, awards, profile } from '../../data/profile'
import type { TimelineEntry } from '../../data/profile'
import styles from './JourneyTimeline.module.css'

function Track({ title, items }: { title: string; items: TimelineEntry[] }) {
  return (
    <div className={styles.track}>
      <h3 className={styles.trackTitle}>{title}</h3>
      <div className={styles.spine}>
        {items.map((item, i) => (
          <motion.div
            key={`${item.role}-${item.period}`}
            className={styles.entry}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.dot} />
            <span className={styles.period}>{item.period}</span>
            <span className={styles.role}>{item.role}</span>
            <span className={styles.org}>{item.org}</span>
            {item.note && <span className={styles.note}>{item.note}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function JourneyTimeline() {
  return (
    <section id="journey" className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.kicker}>❋&nbsp;&nbsp;JOURNEY&nbsp;&nbsp;/&nbsp;&nbsp;02</span>
        <h2 className={styles.heading}>
          B.S. <span className={styles.sep}>→</span> M.S. <span className={styles.sep}>→</span> Ph.D.
          <span className={styles.headingSub}>all in Computer Science, all at Jeonbuk National University.</span>
        </h2>

        <div className={styles.columns}>
          <Track title="Education" items={education} />
          <Track title="Experience & Service" items={experience} />
        </div>

        <motion.div
          className={styles.credentials}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.7 }}
        >
          {awards.map((a) => (
            <div key={a} className={styles.cred}>
              <span className={styles.credIcon}>🏆</span>
              {a}
            </div>
          ))}
          <div className={styles.cred}>
            <span className={styles.credIcon}>🚁</span>
            {profile.certification}
          </div>
          <div className={styles.cred}>
            <span className={styles.credIcon}>🗣️</span>
            {profile.language}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
