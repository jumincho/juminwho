import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './IntroSequence.module.css'

/**
 * FC / FIFA-Online "player pack opening" parody intro.
 *
 * The warp tunnel runs continuously while the elements pop up over it:
 *   0.0  warp tunnel starts (travels forward the whole time)
 *   1.5  taegukgi pops in (center-top, floats)
 *   3.0  "Ph.D. Student" pops in below it
 *   4.5  JBNU crest pops in below that
 *   6.0  HYPERSPACE — tunnel accelerates, the three elements vibrate
 *   7.5  blinding white flash → tunnel + trio vanish
 *   7.8  final card (card.jpg) walks out on a grand stage
 *  12.0  fade out → onComplete
 */

const SK_FLAG = `${import.meta.env.BASE_URL}intro/flag.png`
const LOGO = `${import.meta.env.BASE_URL}intro/club.png`
const CARD = `${import.meta.env.BASE_URL}intro/card.webp` // provided card art (transparent, optimized)

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)
  const [flash, setFlash] = useState(0)
  const [shake, setShake] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef(0)
  const doneRef = useRef(false)

  const streaks = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => ({
        a: (i / 64) * 360 + Math.random() * 6,
        delay: Math.random() * 2,
        dur: 0.8 + Math.random() * 0.9,
        gold: Math.random() > 0.5,
        len: 70 + Math.random() * 240,
      })),
    [],
  )
  const confetti = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
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
    setPhase(9)
    window.setTimeout(onComplete, 700)
  }

  useEffect(() => {
    const bump = (p: number) => {
      phaseRef.current = p
      setPhase(p)
    }
    const flashPulse = (level: number, ms: number) => {
      setFlash(level)
      window.setTimeout(() => setFlash(0), ms)
    }
    const shakeOnce = (ms = 380) => {
      setShake(true)
      window.setTimeout(() => setShake(false), ms)
    }
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))

    bump(1) // tunnel travels continuously
    at(1000, () => bump(2)) // flag zooms in from the centre and flies past
    at(3000, () => bump(3)) // "Ph.D. Student" flies past
    at(5000, () => bump(4)) // crest flies past
    at(7000, () => bump(5)) // HYPERSPACE overdrive
    at(7500, () => { flashPulse(2, 500); shakeOnce(460) }) // blinding burst
    at(7800, () => bump(7)) // card walkout on the new stage
    at(12000, finish)

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // gold/neon particle field that accelerates with the tunnel
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
      vy: 0.25 + Math.random() * 1,
      a: 0.2 + Math.random() * 0.6,
      gold: Math.random() > 0.45,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const p = phaseRef.current
      const speed = p >= 7 ? 0.5 : p >= 5 ? 6 : p >= 2 ? 2.2 : 1.4
      for (const o of ps) {
        o.y -= o.vy * speed
        if (o.y < -10) {
          o.y = h + 10
          o.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
        ctx.fillStyle = o.gold ? `rgba(245,200,90,${o.a})` : `rgba(120,150,255,${o.a})`
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

      {/* continuous warp tunnel (accelerates at hyperspace) */}
      <div
        className={`${styles.tunnel} ${phase >= 5 ? styles.hyper : ''} ${phase >= 7 ? styles.tunnelGone : ''}`}
        aria-hidden
      >
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

      {/* fly-through: each element zooms from the centre toward the camera and passes, one at a time */}
      <img id="nation-flag" src={SK_FLAG} alt="South Korea" className={`${styles.flyEl} ${styles.flyFlag} ${phase >= 2 ? styles.fly : ''}`} />
      <div id="position-text" className={`${styles.flyEl} ${styles.flyPos} ${phase >= 3 ? styles.fly : ''}`}>Ph.D. Student</div>
      <img id="affiliation-logo" src={LOGO} alt="Jeonbuk National University" className={`${styles.flyEl} ${styles.flyLogo} ${phase >= 4 ? styles.fly : ''}`} />

      {/* final card walkout */}
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
        <img id="final-card" src={CARD} alt="JUMIN CHO — Ph.D. Student" className={`${styles.cardImg} ${phase >= 7 ? styles.cardIn : ''}`} />
      </div>

      {/* white flash */}
      <div className={`${styles.flash} ${flash === 1 ? styles.flashOn : ''} ${flash === 2 ? styles.flashBlind : ''}`} aria-hidden />

      <button type="button" className={styles.skip} onClick={finish}>Skip ⏭</button>
    </div>
  )
}
