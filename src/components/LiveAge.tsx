import { useEffect, useRef } from 'react'

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000
const DECIMALS = 8

function formatAge(birthMs: number) {
  return ((Date.now() - birthMs) / YEAR_MS).toFixed(DECIMALS)
}

interface Props {
  birth: string
  className?: string
}

/**
 * Age in years, counted live from the birth instant (KST) and shown to
 * 8 decimal places. The last digit advances about three times a second
 * (1e-8 year ≈ 0.32 s), so a 100 ms repaint straight to the DOM is enough;
 * React never re-renders. Reduced-motion users get a 1 Hz update.
 * The exact seconds-level figure is decorative, so it is hidden from
 * assistive tech and a plain whole-year value is exposed instead.
 */
export default function LiveAge({ birth, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const a11yRef = useRef<HTMLSpanElement>(null)
  const birthMs = new Date(birth).getTime()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (a11yRef.current) {
      const wholeYears = Math.floor((Date.now() - birthMs) / YEAR_MS)
      a11yRef.current.textContent = `${wholeYears} years old`
    }

    const paint = () => {
      el.textContent = formatAge(birthMs)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    paint()
    const timer = window.setInterval(paint, reduce ? 1000 : 100)
    return () => window.clearInterval(timer)
  }, [birthMs])

  return (
    <>
      <span ref={ref} className={className} aria-hidden="true" />
      <span ref={a11yRef} className="visually-hidden" />
    </>
  )
}
