import { motion } from 'framer-motion'
import { profile } from '../../data/profile'
import MagneticButton from '../MagneticButton'
import styles from './LandingFooter.module.css'

const socials = [
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'NLL Lab', href: profile.links.lab },
  { label: 'GitHub', href: profile.links.github },
  { label: 'Email', href: `mailto:${profile.links.email}` },
]

export default function LandingFooter() {
  const year = new Date().getFullYear()
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.inner}>
        <motion.span
          className={styles.kicker}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ❋&nbsp;&nbsp;CONTACT&nbsp;&nbsp;/&nbsp;&nbsp;02
        </motion.span>

        <motion.h2
          className={styles.big}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&rsquo;s&nbsp;talk.
        </motion.h2>

        <MagneticButton strength={0.25}>
          <a href={`mailto:${profile.links.email}`} className={styles.email} data-cursor>
            {profile.links.email}
          </a>
        </MagneticButton>

        <div className={styles.socials}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className={styles.social}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              data-cursor
            >
              {s.label}
              <span className={styles.socialArrow}>↗</span>
            </a>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>© {year} {profile.name} — {profile.nameKo}</span>
          <span className={styles.loc}>{profile.locationLong}</span>
          <a href="#top" className={styles.top} data-cursor>BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  )
}
