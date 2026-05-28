import styles from './Contact.module.css'
import MagneticLink from './effects/MagneticLink'
import Marquee from './effects/Marquee'

const FOOTER_MARQUEE = [
  'GET IN TOUCH',
  'AVAILABLE FOR COLLABORATION',
  'TALK TO ME · LLM · RAG · CAUSALITY',
  'JEONJU · KOREA',
  'A DREAMER OF AN AI EXPERT',
]

const LINKS = [
  { label: 'Email', value: 'properly59@gmail.com', href: 'mailto:properly59@gmail.com' },
  { label: 'GitHub', value: 'github.com/jumincho', href: 'https://github.com/jumincho' },
  { label: 'LinkedIn', value: 'in/jumincho-42b126338', href: 'https://www.linkedin.com/in/jumincho-42b126338' },
  { label: 'Lab', value: 'NLLLab @ JBNU', href: 'https://sites.google.com/view/nlllab/main' },
]

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.marquee}>
        <Marquee items={FOOTER_MARQUEE} speed={42} />
      </div>

      <div className={styles.container}>
        <div className={styles.headline}>
          <span className={styles.eyebrow}>// contact · let us build together</span>
          <h2 className={styles.title}>
            Got a problem worth&nbsp;
            <span className={styles.italic}>solving</span>?
          </h2>
          <p className={styles.lede}>
            I am always up for collaborations on language model reasoning, retrieval and
            causality. Drop a line — I read every email.
          </p>
        </div>

        <div className={styles.cta}>
          <MagneticLink strength={0.4}>
            <a href="mailto:properly59@gmail.com" className={styles.bigBtn}>
              <span className={styles.bigBtnText}>
                <span>properly59</span>
                <span className={styles.at}>@</span>
                <span>gmail.com</span>
              </span>
              <span className={styles.bigBtnArrow}>→</span>
            </a>
          </MagneticLink>
        </div>

        <div className={styles.linkGrid}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={styles.linkItem}
            >
              <span className={styles.linkLabel}>{l.label}</span>
              <span className={styles.linkValue}>{l.value}</span>
              <span className={styles.linkArrow} aria-hidden>↗</span>
            </a>
          ))}
        </div>

        <div className={styles.bottomRow}>
          <span className={styles.copy}>
            © {year} JUMIN CHO · 조주민 · all rights reserved
          </span>
          <span className={styles.tech}>
            crafted with react · framer motion · tasteless amounts of conic gradients
          </span>
        </div>
      </div>
    </footer>
  )
}
