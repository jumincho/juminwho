import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { JBNUShield, KoreanFlag, LeagueCrest, PhDBadge, PlayerSilhouette } from './symbols'
import styles from './WalkoutSequence.module.css'

type Stage =
  | 'pack'
  | 'tunnel'
  | 'position'
  | 'nation'
  | 'league'
  | 'club'
  | 'ovr'
  | 'card'
  | 'celebration'
  | 'fade'
  | 'done'

// Timing — pack opens, the iconic tunnel walk plays long enough to read,
// each reveal is a rapid jump cut (~1.1s) like EA FC, then OVR buildup and final card.
const STAGE_DURATIONS: Record<Stage, number> = {
  pack: 1100,
  tunnel: 2400,
  position: 1100,
  nation: 1100,
  league: 1100,
  club: 1100,
  ovr: 900,
  card: 1800,
  celebration: 1000,
  fade: 500,
  done: 0,
}

const ORDER: Stage[] = [
  'pack',
  'tunnel',
  'position',
  'nation',
  'league',
  'club',
  'ovr',
  'card',
  'celebration',
  'fade',
  'done',
]

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
    let cancelled = false
    let i = 0
    function next() {
      if (cancelled) return
      i += 1
      if (i >= ORDER.length) {
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current()
        }
        return
      }
      const s = ORDER[i]
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

      <button type="button" className={styles.skip} onClick={handleSkip} aria-label="Skip intro">
        SKIP ▸
      </button>

      <div className={styles.stagger} aria-hidden>
        <StaggerStep label="PACK" current={stage} stages={['pack']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="TUNNEL" current={stage} stages={['tunnel']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="POSITION" current={stage} stages={['position']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="NATION" current={stage} stages={['nation']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="LEAGUE" current={stage} stages={['league']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="CLUB" current={stage} stages={['club']} />
        <span className={styles.staggerDot}>•</span>
        <StaggerStep label="PLAYER" current={stage} stages={['ovr', 'card', 'celebration']} />
      </div>

      <AnimatePresence mode="wait">
        {stage === 'pack' && (
          <motion.div
            key="pack"
            className={styles.packStage}
            initial={{ opacity: 0, y: 40, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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

        {stage === 'tunnel' && (
          <motion.div
            key="tunnel"
            className={styles.tunnelStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'brightness(2.5)' }}
            transition={{ duration: 0.45 }}
          >
            <TunnelScene />
          </motion.div>
        )}

        {stage === 'position' && (
          <RevealCut key="position" label="POSITION" sub="Ph.D · AI RESEARCHER" tint="#a855f7">
            <PhDBadge style={{ width: 360, height: 360 }} />
          </RevealCut>
        )}

        {stage === 'nation' && (
          <RevealCut
            key="nation"
            label="NATION"
            sub="REPUBLIC OF KOREA"
            tint="#cd2e3a"
            windEffect
          >
            <div className={styles.flagFrame}>
              <KoreanFlag style={{ width: 380, height: 250 }} />
            </div>
          </RevealCut>
        )}

        {stage === 'league' && (
          <RevealCut key="league" label="LEAGUE" sub="ACADEMIA · RESEARCH" tint="#0c4a6e">
            <LeagueCrest style={{ width: 320, height: 320 }} />
          </RevealCut>
        )}

        {stage === 'club' && (
          <RevealCut
            key="club"
            label="CLUB"
            sub="JEONBUK NATIONAL UNIVERSITY · NLLLab"
            tint="#0a3d62"
          >
            <JBNUShield style={{ width: 320, height: 320 }} />
          </RevealCut>
        )}

        {stage === 'ovr' && (
          <motion.div
            key="ovr"
            className={styles.ovrStage}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.6, filter: 'blur(30px) brightness(3)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.ovrHalo} aria-hidden />
            <div className={styles.ovrLabel}>OVERALL</div>
            <OVRNumber />
            <div className={styles.ovrTier}>PRIME WALKOUT</div>
          </motion.div>
        )}

        {(stage === 'card' || stage === 'celebration') && (
          <motion.div
            key="card"
            className={styles.cardStage}
            initial={{ scale: 0.1, rotateY: 360, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            transition={{
              scale: { type: 'spring', stiffness: 380, damping: 24 },
              rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.4 },
            }}
          >
            <FinalCard />
            <motion.div
              className={styles.confetti}
              initial={{ opacity: 0 }}
              animate={{ opacity: stage === 'celebration' ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ConfettiBurst />
            </motion.div>
            {stage === 'celebration' && <LightBeams />}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function StaggerStep({
  label,
  current,
  stages,
}: {
  label: string
  current: Stage
  stages: Stage[]
}) {
  const currentIdx = ORDER.indexOf(current)
  const matchIdx = ORDER.indexOf(stages[stages.length - 1])
  const isActive = stages.includes(current)
  const isDone = currentIdx > matchIdx
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

function TunnelScene() {
  return (
    <div className={styles.tunnel}>
      {/* Perspective walls implied via clip-path trapezoids */}
      <div className={styles.tunnelCeiling} aria-hidden />
      <div className={styles.tunnelFloor} aria-hidden />
      <div className={styles.tunnelWallL} aria-hidden />
      <div className={styles.tunnelWallR} aria-hidden />
      {/* Vanishing-point bright stadium-exit light */}
      <div className={styles.tunnelGlow} aria-hidden />
      {/* Two iconic golden vertical beams flaring up along inner edges */}
      <div className={styles.tunnelBeamL} aria-hidden />
      <div className={styles.tunnelBeamR} aria-hidden />
      {/* Triangle diagonal lights converging at top of exit — the 86+ OVR signal */}
      <div className={styles.tunnelDiagL} aria-hidden />
      <div className={styles.tunnelDiagR} aria-hidden />
      {/* Drifting floor fog */}
      <div className={styles.tunnelFog} aria-hidden />
      <div className={styles.tunnelFogB} aria-hidden />
      {/* Player silhouette walking out toward camera */}
      <motion.div
        className={styles.silhouette}
        initial={{ scale: 0.18, y: -40, opacity: 0 }}
        animate={{
          scale: [0.18, 0.45, 0.9, 1],
          y: [-40, 30, 90, 110],
          opacity: [0, 0.7, 1, 1],
        }}
        transition={{
          duration: 2.3,
          times: [0, 0.35, 0.85, 1],
          ease: [0.42, 0, 0.58, 1],
        }}
      >
        <motion.div
          className={styles.silhouetteSway}
          animate={{ rotate: [-1.2, 1.2, -1.2] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PlayerSilhouette style={{ width: '100%', height: '100%' }} />
        </motion.div>
      </motion.div>
    </div>
  )
}

function RevealCut({
  children,
  label,
  sub,
  tint,
  windEffect = false,
}: {
  children: React.ReactNode
  label: string
  sub: string
  tint: string
  windEffect?: boolean
}) {
  return (
    <motion.div
      className={styles.revealCut}
      initial={{ opacity: 0, scale: 0.6, filter: 'blur(30px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(20px)' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={styles.revealHalo}
        style={{ ['--tint' as string]: tint } as React.CSSProperties}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 1, 0.6], scale: [0.4, 1.6, 2] }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        aria-hidden
      />
      <div className={styles.revealCorner + ' ' + styles.revealCornerTL} aria-hidden />
      <div className={styles.revealCorner + ' ' + styles.revealCornerTR} aria-hidden />
      <div className={styles.revealCorner + ' ' + styles.revealCornerBL} aria-hidden />
      <div className={styles.revealCorner + ' ' + styles.revealCornerBR} aria-hidden />
      <motion.div
        className={styles.revealCategory}
        initial={{ opacity: 0, y: -20, letterSpacing: '0.8em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.5em' }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {label}
      </motion.div>
      <motion.div
        className={`${styles.revealArt} ${windEffect ? styles.windRipple : ''}`}
        initial={{ scale: 0.7 }}
        animate={{ scale: [0.7, 1.15, 1] }}
        transition={{ duration: 0.55, times: [0, 0.6, 1], ease: 'easeOut' }}
      >
        {children}
      </motion.div>
      <motion.div
        className={styles.revealSub}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {sub}
      </motion.div>
    </motion.div>
  )
}

function OVRNumber() {
  const [n, setN] = useState(70)
  useEffect(() => {
    const start = performance.now()
    const duration = 700
    let raf = 0
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(70 + eased * 29))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <div className={styles.ovrNumber}>{n}</div>
}

function FinalCard() {
  return (
    <div className={styles.cardWrap}>
      <div className={styles.cardFoil}>
        <div className={styles.cardInner}>
          <div className={styles.cardRating}>
            <span className={styles.ratingNum}>99</span>
            <span className={styles.ratingPos}>PHD</span>
            <div className={styles.cardFlag}>
              <KoreanFlag style={{ width: 56, height: 36 }} />
            </div>
            <div className={styles.cardShield}>
              <JBNUShield style={{ width: 48, height: 48 }} />
            </div>
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
            style={{ background: color, transform: `rotate(${angle}deg)` }}
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
          style={{ transform: `rotate(${(i * 360) / 12}deg)` }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 1, 0.4], opacity: [0, 1, 0.6, 0] }}
          transition={{ duration: 1.2, delay: i * 0.04, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
