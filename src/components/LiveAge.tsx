import { useEffect, useRef } from 'react'

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000
const DECIMALS = 12

function formatAge(birthMs: number) {
  // performance.now() gives sub-millisecond resolution, so the trailing
  // digits keep moving between frames instead of stepping once per ms.
  const now = performance.timeOrigin + performance.now()
  return ((now - birthMs) / YEAR_MS).toFixed(DECIMALS)
}

interface Props {
  birth: string
  className?: string
}

/**
 * Age in years, counted live from the birth instant (KST) and shown to
 * 12 decimal places. Writes straight to the DOM every animation frame
 * so React never re-renders; reduced-motion users get a 1 Hz update.
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
    if (reduce) {
      paint()
      const timer = window.setInterval(paint, 1000)
      return () => window.clearInterval(timer)
    }

    let raf = 0
    const loop = () => {
      paint()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [birthMs])

  return (
    <>
      <span ref={ref} className={className} aria-hidden="true" />
      <span ref={a11yRef} className="visually-hidden" />
    </>
  )
}
