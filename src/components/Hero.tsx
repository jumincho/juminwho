import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import PlayerCard from './walkout/PlayerCard'
import WalkoutSequence from './walkout/WalkoutSequence'
import ScrambleText from './effects/ScrambleText'
import MagneticLink from './effects/MagneticLink'
import Marquee from './effects/Marquee'
import styles from './Hero.module.css'

const FOCUS = [
  { tag: 'NLP', label: 'Natural Language Processing', tint: '#fbbf24' },
  { tag: 'RAG', label: 'Retrieval-Augmented Reasoning', tint: '#ec4899' },
  { tag: 'LLM', label: 'Large Language Models', tint: '#8b5cf6' },
  { tag: 'CAUSAL', label: 'Causality-Aware Generation', tint: '#06b6d4' },
] as const

const MARQUEE = [
  'AI RESEARCHER',
  'PhD STUDENT',
  'JEONBUK NATIONAL UNIVERSITY',
  'NLLLab',
  'NLP · RAG · REASONING',
  'CAUSALITY',
  'A DREAMER OF AN AI EXPERT',
] as const

export default function Hero() {
  const reduced = useReducedMotion()
  const [walkoutDone, setWalkoutDone] = useState(false)
  const [pageReady, setPageReady] = useState(false)

  useEffect(() => {
    const played = sessionStorage.getItem('walkout-played-v2')
    if (played || reduced) {
      setWalkoutDone(true)
      setPageReady(true)
    }
  }, [reduced])

  const handleWalkoutComplete = useCallback(() => {
    sessionStorage.setItem('walkout-played-v2', '1')
    setWalkoutDone(true)
    window.setTimeout(() => setPageReady(true), 80)
  }, [])

  const replayWalkout = useCallback(() => {
    sessionStorage.removeItem('walkout-played-v2')
    setWalkoutDone(false)
    setPageReady(false)
  }, [])

  return (
    <>
      {!walkoutDone && <WalkoutSequence onComplete={handleWalkoutComplete} />}

      <section className={styles.hero} id="about">
        <div className={styles.container}>
          <div className={styles.grid}>
            <motion.div
              className={styles.text}
              initial={{ opacity: 0, x: -40 }}
              animate={pageReady ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.eyebrow}>
                <span className={styles.eyeDot} />
                <span>Live · Jeonju, Republic of Korea 🇰🇷</span>
              </div>

              <h1 className={styles.name}>
                <span className={styles.nameLine1}>
                  <ScrambleText text="JUMIN" reveal={pageReady} />
                </span>
                <span className={styles.nameLine2}>
                  <ScrambleText text="CHO" reveal={pageReady} />
                </span>
                <motion.span
                  className={styles.nameAccent}
                  initial={{ scaleX: 0 }}
                  animate={pageReady ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                />
              </h1>

              <p className={styles.title}>
                <span className={styles.titleAccent}>AI Researcher</span>
                <span className={styles.divider}>·</span>
                <span>Ph.D Student @ JBNU</span>
              </p>

              <p className={styles.intro}>
                <span className={styles.quote}>"</span>
                A dreamer of an Artificial Intelligence expert — building language models that
                reason, retrieve and explain themselves, one paper at a time.
                <span className={styles.quote}>"</span>
              </p>

              <div className={styles.metaGrid}>
                <Meta label="Lab" value="NLLLab" />
                <Meta label="Advisor" value="Prof. Hyun-Je Song" />
                <Meta label="Program" value="Ph.D · Computer Science" />
                <Meta label="Since" value="2026 — 2029 (target)" />
              </div>

              <div className={styles.focusList}>
                {FOCUS.map((f, i) => (
                  <motion.span
                    key={f.tag}
                    className={styles.chip}
                    style={{ ['--tint' as string]: f.tint } as React.CSSProperties}
                    initial={{ opacity: 0, y: 12 }}
                    animate={pageReady ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.07, duration: 0.4 }}
                  >
                    <span className={styles.chipTag}>{f.tag}</span>
                    <span className={styles.chipLabel}>{f.label}</span>
                  </motion.span>
                ))}
              </div>

              <div className={styles.ctaRow}>
                <MagneticLink className={styles.ctaPrimary} strength={0.4}>
                  <Link to="/cv" className={styles.ctaPrimaryInner}>
                    <span>EXPLORE THE CV</span>
                    <Arrow />
                  </Link>
                </MagneticLink>
                <MagneticLink className={styles.ctaGhost}>
                  <Link to="/projects" className={styles.ctaGhostInner}>
                    <span>PROJECTS</span>
                  </Link>
                </MagneticLink>
                <MagneticLink className={styles.ctaGhost}>
                  <Link to="/blog" className={styles.ctaGhostInner}>
                    <span>BLOG</span>
                  </Link>
                </MagneticLink>
              </div>

              <div className={styles.linkRow}>
                <MagneticLink className={styles.iconLinkWrap}>
                  <a href="mailto:properly59@gmail.com" className={styles.iconLink}>
                    <IconMail />
                    <span>properly59@gmail.com</span>
                  </a>
                </MagneticLink>
                <span className={styles.linkSep}>/</span>
                <MagneticLink className={styles.iconLinkWrap}>
                  <a
                    href="https://github.com/jumincho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconLink}
                  >
                    <IconGithub />
                    <span>github.com/jumincho</span>
                  </a>
                </MagneticLink>
                <span className={styles.linkSep}>/</span>
                <MagneticLink className={styles.iconLinkWrap}>
                  <a
                    href="https://www.linkedin.com/in/jumincho-42b126338"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconLink}
                  >
                    <IconLinkedIn />
                    <span>linkedin</span>
                  </a>
                </MagneticLink>
                <span className={styles.linkSep}>/</span>
                <MagneticLink className={styles.iconLinkWrap}>
                  <a
                    href="https://sites.google.com/view/nlllab/main"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconLink}
                  >
                    <IconLab />
                    <span>NLLLab</span>
                  </a>
                </MagneticLink>
              </div>

              <button type="button" className={styles.replay} onClick={replayWalkout}>
                <span className={styles.replayIcon}>↻</span>
                <span>Replay walkout</span>
              </button>
            </motion.div>

            <motion.div
              className={styles.cardSlot}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={pageReady ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlayerCard reveal={pageReady} />
              <div className={styles.cardCaption}>
                <span>OVR</span>
                <strong>99</strong>
                <span>·</span>
                <span>FC EDITION</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className={styles.marquee}>
          <Marquee items={[...MARQUEE]} speed={36} />
        </div>

        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={pageReady ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <span>SCROLL</span>
          <span className={styles.scrollIcon} />
        </motion.div>
      </section>
    </>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  )
}

function Arrow() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden>
      <path d="M1 6h17M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconGithub() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12.1c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.4.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8 18V10H5v8h3zm-1.5-9.3a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4zM18 18v-4.4c0-2.4-1.3-3.5-3-3.5-1.4 0-2 .8-2.3 1.3V10H10v8h3v-4.3c0-.3 0-.6.1-.8.2-.6.7-1.2 1.6-1.2 1.1 0 1.6.9 1.6 2.2V18h3z"/>
    </svg>
  )
}

function IconLab() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 3v6L4 19a2 2 0 002 3h12a2 2 0 002-3l-5-10V3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3h8M7 14h10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
