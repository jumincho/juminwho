import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { pipeline, publication, focus } from '../../data/profile'
import styles from './ResearchShowcase.module.css'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const node = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}
const link = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function ResearchShowcase() {
  return (
    <section id="research" className={styles.section}>
      <div className={styles.inner}>
        <motion.span
          className={styles.kicker}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ❋&nbsp;&nbsp;RESEARCH&nbsp;&nbsp;/&nbsp;&nbsp;01
        </motion.span>

        <motion.h2
          className={styles.statement}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8 }}
        >
          AI Researcher building <em>retrieval-augmented</em>,{' '}
          <em>causality-based structured reasoning</em> for{' '}
          <em>radiology report generation</em>.
        </motion.h2>

        <motion.div
          className={styles.pipeline}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-12%' }}
        >
          {pipeline.map((p, i) => (
            <Fragment key={p.label}>
              <motion.div className={styles.node} variants={node}>
                <span className={styles.nodeIcon}>{p.icon}</span>
                <span className={styles.nodeLabel}>{p.label}</span>
                <span className={styles.nodeSub}>{p.sub}</span>
              </motion.div>
              {i < pipeline.length - 1 && (
                <motion.div className={styles.connector} variants={link}>
                  <span className={styles.flow} />
                </motion.div>
              )}
            </Fragment>
          ))}
        </motion.div>

        <div className={styles.bottom}>
          <motion.a
            className={styles.pubCard}
            href="#journey"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7 }}
            data-cursor
          >
            <span className={styles.pubTag}>SELECTED PUBLICATION · {publication.venue}</span>
            <h3 className={styles.pubTitle}>{publication.title}</h3>
            <span className={styles.pubArrow}>Causality-Based Radiology Reporting →</span>
          </motion.a>

          <motion.div
            className={styles.focusBox}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className={styles.focusLabel}>FOCUS</span>
            <ul className={styles.focusList}>
              {focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
