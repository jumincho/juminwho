import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { JBNUShield, KoreanFlag, PhDBadge, RayBurst } from './symbols'
import styles from './WalkoutSequence.module.css'

type Stage = 'curtain' | 'flag' | 'shield' | 'phd' | 'whoosh' | 'card' | 'fade' | 'done'

const STAGE_DURATIONS: Record<Stage, number> = {
  curtain: 500,
  flag: 1700,
  shield: 1700,
  phd: 1700,
  whoosh: 350,
  card: 2400,
  fade: 700,
  done: 0,
}

interface Props {
  onComplete: () => void
}

export default function WalkoutSequence({ onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('curtain')
  const reduced = useReducedMotion()
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (reduced) {
      if (!completedRef.current) {
        completedRef.current = true
        onCompleteRef.current()
      }
      return
    }
    const order: Stage[] = ['curtain', 'flag', 'shield', 'phd', 'whoosh', 'card', 'fade', 'done']
    let cancelled = false
    let i = 0
    function next() {
      if (cancelled) return
      i += 1
      if (i >= order.length) {
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current()
        }
        return
      }
      const s = order[i]
      setStage(s)
      window.setTimeout(next, STAGE_DURATIONS[s])
    }
    const initial = window.setTimeout(next, STAGE_DURATIONS.curtain)
    return () => {
      cancelled = true
      window.clearTimeout(initial)
    }
  }, [reduced])

  const handleSkip = () => {
    if (completedRef.current) return
    completedRef.current = true
    setStage('done')
    onCompleteRef.current()
  }

  if (reduced) return null
  if (stage === 'done') return null

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: stage === 'fade' ? 0 : 1 }}
      transition={{ duration: stage === 'curtain' ? 0.5 : 0.6 }}
      aria-hidden
    >
      <div className={styles.vignette} aria-hidden />
      <div className={styles.scanlines} aria-hidden />
      <div className={styles.grain} aria-hidden />

      {/* Spinning background rays */}
      <div className={`${styles.rays} ${styles.raysSlow}`} aria-hidden>
        <RayBurst count={18} />
      </div>
      <div className={`${styles.rays} ${styles.raysFast}`} aria-hidden>
        <RayBurst count={24} />
      </div>

      <button type="button" className={styles.skip} onClick={handleSkip} aria-label="Skip intro">
        SKIP ▸
      </button>

      <div className={styles.stagger} aria-hidden>
        <span>NATION</span>
        <span className={stage === 'flag' ? styles.active : stage === 'shield' || stage === 'phd' || stage === 'whoosh' || stage === 'card' || stage === 'fade' ? styles.done : ''}>•</span>
        <span>CLUB</span>
        <span className={stage === 'shield' ? styles.active : stage === 'phd' || stage === 'whoosh' || stage === 'card' || stage === 'fade' ? styles.done : ''}>•</span>
        <span>POSITION</span>
        <span className={stage === 'phd' ? styles.active : stage === 'whoosh' || stage === 'card' || stage === 'fade' ? styles.done : ''}>•</span>
        <span>PLAYER</span>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'flag' && <StageBlock key="flag" label="REPUBLIC OF KOREA" sub="🇰🇷 NATION" tint="#cd2e3a"><KoreanFlag style={{ width: 380, height: 250 }} /></StageBlock>}
        {stage === 'shield' && <StageBlock key="shield" label="JEONBUK NATIONAL UNIVERSITY" sub="NLLLAB · COMPUTER SCIENCE" tint="#0a3d62"><JBNUShield style={{ width: 220, height: 260 }} /></StageBlock>}
        {stage === 'phd' && <StageBlock key="phd" label="AI RESEARCHER" sub="ADVISOR · PROF. HYUN-JE SONG" tint="#8b5cf6"><PhDBadge style={{ width: 360, height: 360 }} /></StageBlock>}
        {(stage === 'whoosh' || stage === 'card') && (
          <motion.div
            key="card"
            className={styles.cardStage}
            initial={{ scale: 0.05, rotateY: 540, opacity: 0 }}
            animate={{
              scale: stage === 'whoosh' ? 1.6 : 1,
              rotateY: 0,
              opacity: 1,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <FinalCard flash={stage === 'whoosh'} />
            <motion.div
              className={styles.confetti}
              initial={{ opacity: 0 }}
              animate={{ opacity: stage === 'card' ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ConfettiBurst />
            </motion.div>
            <motion.p
              className={styles.cardSub}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: stage === 'card' ? 1 : 0, y: stage === 'card' ? 0 : 12 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span>A DREAMER</span>
              <span className={styles.dot}>·</span>
              <span>AI EXPERT IN THE MAKING</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function StageBlock({
  children,
  label,
  sub,
  tint,
}: {
  children: React.ReactNode
  label: string
  sub: string
  tint: string
}) {
  return (
    <motion.div
      className={styles.stageBlock}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: [0.4, 1.18, 1] }}
      exit={{ opacity: 0, scale: 0.55, filter: 'blur(20px)' }}
      transition={{ duration: 0.55, times: [0, 0.6, 1], ease: 'easeOut' }}
    >
      <motion.div
        className={styles.flashRing}
        style={{ ['--tint' as string]: tint } as React.CSSProperties}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 1, 0], scale: [0.4, 1.6, 2] }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        aria-hidden
      />
      <div className={styles.stageArt}>{children}</div>
      <motion.div
        className={styles.stageLabel}
        initial={{ opacity: 0, y: 30, letterSpacing: '0.6em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.32em' }}
        transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
      >
        {label}
      </motion.div>
      <motion.div
        className={styles.stageSub}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        {sub}
      </motion.div>
    </motion.div>
  )
}

function FinalCard({ flash }: { flash: boolean }) {
  return (
    <div className={`${styles.cardWrap} ${flash ? styles.cardFlash : ''}`}>
      <div className={styles.cardFoil}>
        <div className={styles.cardInner}>
          <div className={styles.cardRating}>
            <span className={styles.ratingNum}>99</span>
            <span className={styles.ratingPos}>PHD</span>
            <div className={styles.cardFlag}><KoreanFlag style={{ width: 56, height: 36 }} /></div>
            <div className={styles.cardShield}><JBNUShield style={{ width: 42, height: 52 }} /></div>
          </div>
          <div className={styles.cardPortrait}>
            <div className={styles.portraitRing} />
            <img
              src={`${import.meta.env.BASE_URL}jumin-cho.jpg`}
              alt=""
              className={styles.portraitImg}
              loading="eager"
            />
          </div>
          <div className={styles.cardName}>JUMIN CHO</div>
          <div className={styles.cardDivider} />
          <div className={styles.cardStats}>
            <Stat label="NLP" value="99" />
            <Stat label="RAG" value="95" />
            <Stat label="LLM" value="93" />
            <Stat label="RES" value="90" />
            <Stat label="DEV" value="88" />
            <Stat label="DRM" value="99" />
          </div>
          <div className={styles.cardClub}>JEONBUK NATIONAL UNIVERSITY · NLLLab</div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 56 }, (_, i) => i)
  return (
    <div className={styles.confettiInner}>
      {pieces.map((i) => {
        const angle = (i * 360) / pieces.length + (i * 13) % 11
        const dist = 280 + ((i * 37) % 220)
        const delay = (i % 7) * 0.04
        const color = ['#fbbf24', '#f97316', '#ec4899', '#06b6d4', '#a855f7', '#22d3ee'][i % 6]
        return (
          <motion.span
            key={i}
            className={styles.confettiPiece}
            style={{
              background: color,
              transform: `rotate(${angle}deg)`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * dist,
              y: Math.sin((angle * Math.PI) / 180) * dist,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.4],
              rotate: angle + 720,
            }}
            transition={{ duration: 1.6, delay, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}
