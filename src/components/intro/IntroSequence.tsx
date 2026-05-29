import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { profile } from '../../data/profile'
import styles from './IntroSequence.module.css'

/**
 * FC / FIFA-Online "player pack opening" parody intro.
 *
 * Phases (ms):
 *  0.0  warp tunnel        2.3 white flash (tunnel exit)
 *  2.5  nation flag drop   3.0 impact (shake + glow)
 *  4.0  position slam      4.5 impact
 *  5.5  affiliation burn-in
 *  6.5  buildup (vibrate + glow)
 *  7.5  blinding burst (trio vanishes)
 *  7.8  walkout: final card spins + scales in
 *  12.5 fade out -> onComplete
 *
 * Asset swap points are marked with ⟪REPLACE⟫ comments below.
 */

const SK_FLAG = `${import.meta.env.BASE_URL}intro/flag.png`       // South Korea flag (user asset)
const LOGO = `${import.meta.env.BASE_URL}intro/club.png`          // Jeonbuk National University crest (user asset)
const PHOTO = `${import.meta.env.BASE_URL}jumin-cho.jpg`          // final card photo

// Parody FUT-card attributes (obvious joke — not factual skill claims)
const STATS: [string, number][] = [
  ['INT', 99], ['RES', 98],
  ['NLP', 97], ['RSN', 96],
  ['GRT', 99], ['DRM', 99],
]

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)
  const [flash, setFlash] = useState(0) // 0 none, 1 medium, 2 blinding
  const [shake, setShake] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef(0)
  const doneRef = useRef(false)

  // randomised warp streaks + confetti, computed once
  const streaks = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        a: (i / 60) * 360 + Math.random() * 6,
        delay: Math.random() * 1.8,
        dur: 0.7 + Math.random() * 0.8,
        gold: Math.random() > 0.5,
        len: 60 + Math.random() * 220,
      })),
    [],
  )
  const confetti = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
        x: Math.random() * 100,
        delay: Math.random() * 3,
        dur: 2.6 + Math.random() * 2.4,
        rot: Math.random() * 360,
        gold: Math.random() > 0.4,
        w: 5 + Math.random() * 6,
      })),
    [],
  )

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setPhase(9) // fade-out class
    window.setTimeout(onComplete, 700)
  }

  // ---- orchestration timeline ----
  useEffect(() => {
    const bump = (p: number) => {
      phaseRef.current = p
      setPhase(p)
    }
    const flashPulse = (level: number, ms: number) => {
      setFlash(level)
      window.setTimeout(() => setFlash(0), ms)
    }
    const shakeOnce = (ms = 320) => {
      setShake(true)
      window.setTimeout(() => setShake(false), ms)
    }

    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))

    bump(1) // tunnel
    at(2300, () => flashPulse(1, 600)) // tunnel exit flash
    at(2500, () => bump(2)) // flag drop
    at(3000, () => { shakeOnce(); })
    at(4000, () => bump(3)) // position slam
    at(4500, () => shakeOnce())
    at(5500, () => bump(4)) // affiliation burn-in
    at(6500, () => bump(5)) // buildup
    at(7500, () => { flashPulse(2, 450); shakeOnce(450); }) // blinding burst
    at(7800, () => bump(7)) // walkout / card
    at(12500, finish) // auto end

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- gold/neon particle field (canvas) ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let raf = 0
    let w = 0
    let h = 0
    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    type P = { x: number; y: number; r: number; vy: number; a: number; gold: boolean }
    const ps: P[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.2 + Math.random() * 0.9,
      a: 0.2 + Math.random() * 0.6,
      gold: Math.random() > 0.45,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const p = phaseRef.current
      const speed = p >= 7 ? 0.6 : p === 5 ? 4.5 : p >= 2 ? 1.6 : 1
      for (const o of ps) {
        o.y -= o.vy * speed
        if (o.y < -10) {
          o.y = h + 10
          o.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
        ctx.fillStyle = o.gold
          ? `rgba(245,200,90,${o.a})`
          : `rgba(120,150,255,${o.a})`
        ctx.shadowBlur = 8
        ctx.shadowColor = o.gold ? 'rgba(245,190,70,0.8)' : 'rgba(120,150,255,0.7)'
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const rootClass = [
    styles.intro,
    styles[`p${phase}`] || '',
    shake ? styles.shake : '',
    phase === 9 ? styles.fadeOut : '',
  ].join(' ')

  return (
    <div className={rootClass} role="dialog" aria-label="Intro animation">
      <canvas ref={canvasRef} className={styles.particles} aria-hidden />

      {/* Phase 1 — warp tunnel */}
      <div className={`${styles.tunnel} ${phase >= 2 ? styles.tunnelGone : ''}`} aria-hidden>
        <div className={styles.tunnelCore} />
        {streaks.map((s, i) => (
          <span
            key={i}
            className={`${styles.streak} ${s.gold ? styles.streakGold : styles.streakBlue}`}
            style={{
              '--a': `${s.a}deg`,
              '--delay': `${s.delay}s`,
              '--dur': `${s.dur}s`,
              '--len': `${s.len}px`,
            } as CSSProperties}
          />
        ))}
      </div>

      {/* The stacked "trio": flag → position → affiliation */}
      <div className={`${styles.trio} ${phase === 5 ? styles.buildup : ''} ${phase >= 7 ? styles.trioGone : ''}`}>
        <img id="nation-flag" src={SK_FLAG} alt="South Korea" className={`${styles.flag} ${phase >= 2 ? styles.flagIn : ''}`} />
        <div id="position-text" className={`${styles.position} ${phase >= 3 ? styles.positionIn : ''}`}>Ph.D. Candidate</div>
        <img id="affiliation-logo" src={LOGO} alt="Jeonbuk National University" className={`${styles.logo} ${phase >= 4 ? styles.logoIn : ''}`} />
      </div>

      {/* Phase 5 — the final walkout card */}
      <div className={styles.stage} aria-hidden={phase < 7}>
        <div className={styles.confetti}>
          {phase >= 7 &&
            confetti.map((c, i) => (
              <span
                key={i}
                className={`${styles.conf} ${c.gold ? styles.confGold : styles.confBlue}`}
                style={{
                  left: `${c.x}%`,
                  '--delay': `${c.delay}s`,
                  '--dur': `${c.dur}s`,
                  '--rot': `${c.rot}deg`,
                  '--w': `${c.w}px`,
                } as CSSProperties}
              />
            ))}
        </div>

        <div id="final-card" className={`${styles.card} ${phase >= 7 ? styles.cardIn : ''}`}>
          <div className={styles.cardSheen} />
          <div className={styles.cardTop}>
            <div className={styles.cardMeta}>
              <span className={styles.rating}>99</span>
              <span className={styles.pos}>PHD</span>
              <img src={SK_FLAG} alt="" className={styles.cardFlag} />
              <img src={LOGO} alt="" className={styles.cardClub} />
            </div>
            <img src={PHOTO} alt={profile.name} className={styles.cardPhoto} />
          </div>
          <div className={styles.cardName}>{profile.name}</div>
          <div className={styles.cardStats}>
            {STATS.map(([k, v]) => (
              <div key={k} className={styles.stat}>
                <b>{v}</b>
                <span>{k}</span>
              </div>
            ))}
          </div>
          <div className={styles.cardFoot}>AI RESEARCHER · {profile.affiliation}</div>
        </div>
      </div>

      {/* white flash overlay */}
      <div className={`${styles.flash} ${flash === 1 ? styles.flashOn : ''} ${flash === 2 ? styles.flashBlind : ''}`} aria-hidden />

      <button type="button" className={styles.skip} onClick={finish}>Skip ⏭</button>
    </div>
  )
}
