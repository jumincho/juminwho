import { useEffect, useRef } from 'react'

// Birth instant, anchored to KST so every visitor sees the same value.
const BIRTH = new Date('1998-07-10T00:00:00+09:00').getTime()
// Gregorian mean year length (accounts for leap years).
const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000
const DECIMALS = 8

function ageNow() {
  return ((Date.now() - BIRTH) / YEAR_MS).toFixed(DECIMALS)
}

/**
 * A live age counter that ticks in real time (e.g. 27.88421056).
 * Writes straight to the DOM via a ref so it never triggers a React
 * re-render; falls back to a 1 Hz update for reduced-motion users.
 */
export default function LiveAge({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let timer = 0

    const paint = () => {
      el.textContent = ageNow()
    }

    if (reduce) {
      paint()
      timer = window.setInterval(paint, 1000)
    } else {
      const loop = () => {
        paint()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(timer)
    }
  }, [])

  return (
    <span ref={ref} className={className} aria-hidden="true">
      {ageNow()}
    </span>
  )
}
