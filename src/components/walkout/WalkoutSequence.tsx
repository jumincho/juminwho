import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { JBNUShield, KoreanFlag, PhDBadge, RayBurst } from './symbols'
import styles from './WalkoutSequence.module.css'

type Stage =
  | 'pack'
  | 'flash'
  | 'flag'
  | 'position'
  | 'club'
  | 'whoosh'
  | 'card'
  | 'celebration'
  | 'fade'
  | 'done'

// Timing per spec — each step gets enough screen time to read.
const STAGE_DURATIONS: Record<Stage, number> = {
  pack: 1100,
  flash: 500,
  flag: 1400,
  position: 1400,
  club: 1600,
  whoosh: 380,
  card: 1900,
  celebration: 1000,
  fade: 600,
  done: 0,
}

interface Props {
  onComplete: () => void
}

export default function WalkoutSequence({ onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('pack')
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
    const order: Stage[] = [
      'pack',
      'flash',
      'flag',
      'position',
      'club',
      'whoosh',
      'card',
      'celebration',
      'fade',
      'done',
    ]
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
    const initial = window.setTimeout(next, STAGE_DURATIONS.pack)
    return () => {
      cancelled = true
      window.clearTimeout(initial)
    }
  }, [reduced])

  const handleSkip = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    setStage('done')
    onCompleteRef.current()
  }, [])

  if (reduced) return null
  if (stage === 'done') return null

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: stage === 'fade' ? 0 : 1 }}
      transition={{ duration: stage === 'pack' ? 0.4 : 0.5 }}
      aria-hidden
    >
      <div className={styles.vignette} aria-hidden />
      <div className={styles.scanlines} aria-hidden />
      <div className={styles.grain} aria-hidden />

      {/* Smoke / fog layer */}
      <div className={styles.smoke} aria-hidden />
      <div className={styles.smokeB} aria-hidden />

      {/* Spinning background rays (visible from flag stage onward) */}
      <div
        className={`${styles.rays} ${styles.raysSlow} ${
          stage === 'pack' || stage === 'flash' ? styles.raysHidden : ''
        }`}
        aria-hidden
      >
        <RayBurst count={18} />
      </div>
      <div
        className={`${styles.rays} ${styles.raysFast} ${
          stage === 'pack' || stage === 'flash' ? styles.raysHidden : ''
        }`}
        aria-hidden
      >
        <RayBurst count={24} />
      </div>

      <button type="button" className={styles.skip} onClick={handleSkip} aria-label="Skip intro">
        SKIP ▸
      </button>

      <div className={styles.stagger} aria-hidden>
        <StaggerStep label="PACK" current={stage} match={['pack', 'flash']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="NATION" current={stage} match={['flag']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="POSITION" current={stage} match={['position']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="CLUB" current={stage} match={['club']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="PLAYER" current={stage} match={['whoosh', 'card', 'celebration']} />
      </div>

      {/* Flash burst — global overlay independent of AnimatePresence */}
      <AnimatePresence>
        {stage === 'flash' && (
          <motion.div
            key="flash"
            className={styles.flashStage}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.6, 0.2], scale: [0, 2.5, 4, 6] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.4, 0.7, 1], ease: 'easeOut' }}
          >
            <div className={styles.flashCore} />
            <div className={styles.flashRing1} />
            <div className={styles.flashRing2} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Stage 1: Closed pack with pulsing glow */}
        {stage === 'pack' && (
          <motion.div
            key="pack"
            className={styles.packStage}
            initial={{ opacity: 0, y: 40, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4, filter: 'blur(16px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.packGlowOuter} aria-hidden />
            <div className={styles.packGlowInner} aria-hidden />
            <ClosedPack />
            <motion.p
              className={styles.packHint}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span className={styles.packShake}>★</span>
              <span>PRIME PACK · 99 OVR</span>
              <span className={styles.packShake}>★</span>
            </motion.p>
          </motion.div>
        )}

        {/* Stage 3: Flag (Korea) */}
        {stage === 'flag' && (
          <StageBlock
            key="flag"
            label="REPUBLIC OF KOREA"
            sub="🇰🇷 NATION"
            tint="#cd2e3a"
          >
            <KoreanFlag style={{ width: 380, height: 250 }} />
          </StageBlock>
        )}

        {/* Stage 4: Position (Ph.D) */}
        {stage === 'position' && (
          <StageBlock
            key="position"
            label="AI RESEARCHER"
            sub="POSITION · PH.D CANDIDATE"
            tint="#8b5cf6"
          >
            <PhDBadge style={{ width: 360, height: 360 }} />
          </StageBlock>
        )}

        {/* Stage 5: Club (JBNU) */}
        {stage === 'club' && (
          <StageBlock
            key="club"
            label="JEONBUK NATIONAL UNIVERSITY"
            sub="CLUB · NLLLAB · ADVISOR PROF. HYUN-JE SONG"
            tint="#0a3d62"
          >
            <JBNUShield style={{ width: 320, height: 320 }} />
          </StageBlock>
        )}

        {/* Stage 6-7: Player card whoosh + reveal */}
        {(stage === 'whoosh' || stage === 'card' || stage === 'celebration') && (
          <motion.div
            key="card"
            className={styles.cardStage}
            initial={{ scale: 0.05, rotateY: 540, opacity: 0 }}
            animate={{
              scale: stage === 'whoosh' ? 1.7 : 1,
              rotateY: 0,
              opacity: 1,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <FinalCard flash={stage === 'whoosh'} />
            <motion.div
              className={styles.confetti}
              initial={{ opacity: 0 }}
              animate={{ opacity: stage === 'celebration' ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ConfettiBurst />
            </motion.div>
            {stage === 'celebration' && <LightBeams />}
            <motion.p
              className={styles.cardSub}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: stage === 'card' || stage === 'celebration' ? 1 : 0,
                y: stage === 'card' || stage === 'celebration' ? 0 : 12,
              }}
              transition={{ delay: 0.45, duration: 0.5 }}
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

function StaggerStep({
  label,
  current,
  match,
}: {
  label: string
  current: Stage
  match: Stage[]
}) {
  const order: Stage[] = [
    'pack',
    'flash',
    'flag',
    'position',
    'club',
    'whoosh',
    'card',
    'celebration',
    'fade',
    'done',
  ]
  const currentIdx = order.indexOf(current)
  const matchIdx = order.indexOf(match[0])
  const isActive = match.includes(current)
  const isDone = currentIdx > matchIdx + match.length - 1
  return (
    <span className={isActive ? styles.staggerActive : isDone ? styles.staggerDone : ''}>
      {label}
    </span>
  )
}

function ClosedPack() {
  return (
    <div className={styles.pack}>
      <div className={styles.packShell}>
        <div className={styles.packInner}>
          <div className={styles.packLogo}>
            <div className={styles.packLogoDot} />
            <span>JC · 99</span>
          </div>
          <div className={styles.packTitle}>PRIME WALKOUT</div>
          <div className={styles.packDivider} />
          <div className={styles.packSub}>JUMIN CHO · ESTABLISHED 2018</div>
          <div className={styles.packPatternA} />
          <div className={styles.packPatternB} />
          <div className={styles.packEdge} />
        </div>
        <div className={styles.packSeam} />
      </div>
      <div className={styles.packShadow} />
    </div>
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
            <div className={styles.cardShield}><JBNUShield style={{ width: 48, height: 48 }} /></div>
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
  const pieces = Array.from({ length: 80 }, (_, i) => i)
  return (
    <div className={styles.confettiInner}>
      {pieces.map((i) => {
        const angle = (i * 360) / pieces.length + ((i * 13) % 11)
        const dist = 320 + ((i * 37) % 260)
        const delay = (i % 9) * 0.03
        const color = ['#fbbf24', '#f97316', '#ec4899', '#06b6d4', '#a855f7', '#22d3ee', '#22c55e'][
          i % 7
        ]
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

function LightBeams() {
  return (
    <div className={styles.beams} aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <motion.span
          key={i}
          className={styles.beam}
          style={{
            transform: `rotate(${(i * 360) / 12}deg)`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 1, 0.4], opacity: [0, 1, 0.6, 0] }}
          transition={{ duration: 1.2, delay: i * 0.04, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
