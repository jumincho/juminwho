import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile } from '../../data/profile'
import ScrambleText from '../ScrambleText'
import MagneticButton from '../MagneticButton'
import TiltCard from '../TiltCard'
import styles from './HeroCinematic.module.css'

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className={styles.letter}
          style={{ animationDelay: `${0.5 + i * 0.045}s` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  )
}

export default function HeroCinematic() {
  const [alias, setAlias] = useState(false)
  const photo = `${import.meta.env.BASE_URL}jumin-cho.jpg`

  return (
    <section className={styles.hero}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <motion.div
            className={styles.status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className={styles.pulse} />
            {profile.coords} — {profile.locationShort.toUpperCase()}
            <span className={styles.statusSep}>/</span>
            {profile.role.toUpperCase()}
          </motion.div>

          <h1
            className={`${styles.name} ${alias ? styles.nameAlias : ''}`}
            onMouseEnter={() => setAlias(true)}
            onMouseLeave={() => setAlias(false)}
            onFocus={() => setAlias(true)}
            onBlur={() => setAlias(false)}
            onTouchStart={() => setAlias((v) => !v)}
            tabIndex={0}
            data-cursor
            aria-label={profile.name}
          >
            <span className={styles.facePrimary} aria-hidden={alias}>
              <Letters text={profile.name} />
            </span>
            <span className={styles.faceAlias} aria-hidden={!alias} data-text={profile.alias}>
              {profile.alias}
            </span>
          </h1>

          <ScrambleText as="p" className={styles.tagline} text={profile.tagline} delay={900} />

          <motion.p
            className={styles.role}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {profile.roleLong} <span className={styles.at}>@</span> {profile.affiliation}
            <span className={styles.lab}> · {profile.lab}</span>
          </motion.p>

          <motion.div
            className={styles.ctas}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
          >
            <MagneticButton>
              <Link to="/projects" className={`${styles.btn} ${styles.btnPrimary}`} data-cursor>
                Explore Work <span className={styles.arrow}>→</span>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a href={profile.links.emailCompose} className={styles.btn} target="_blank" rel="noopener noreferrer" data-cursor>
                Get in Touch
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <TiltCard className={styles.card}>
            <div className={styles.cardInner}>
              <img src={photo} alt={profile.name} className={styles.photo} loading="eager" />
              <div className={styles.scan} />
              <span className={styles.tickTL} />
              <span className={styles.tickBR} />
              <div className={styles.cardMeta}>
                <span>{profile.nameKo}</span>
                <span>PhD · CS</span>
              </div>
            </div>
            <div className={`${styles.floatChip} ${styles.chipA}`}>🎓 Jeonbuk Nat’l Univ.</div>
            <div className={`${styles.floatChip} ${styles.chipB}`}>📍 {profile.locationShort}</div>
          </TiltCard>
        </motion.div>
      </div>

      <motion.a
        href="#journey"
        className={styles.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        data-cursor
        aria-label="Scroll to research"
      >
        <span>SCROLL</span>
        <span className={styles.scrollLine} />
      </motion.a>
    </section>
  )
}
