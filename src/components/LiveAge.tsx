import { useLayoutEffect, useRef } from 'react'
import { labels } from '../data/profile'

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000
const DECIMALS = 8

interface Props {
  /** ISO 8601 birth instant with a time zone. */
  birth: string
  className?: string
}

/**
 * Age in years since `birth`, to 8 decimal places. The last digit moves about
 * three times a second (1e-8 year ≈ 0.32 s), so the text is repainted every
 * 100 ms straight into the DOM and React never re-renders; with reduced motion
 * it updates once a second. The racing digits are hidden from screen readers,
 * which get the whole number of years instead.
 */
export default function LiveAge({ birth, className }: Props) {
  const digitsRef = useRef<HTMLSpanElement>(null)
  const spokenRef = useRef<HTMLSpanElement>(null)
  const birthMs = new Date(birth).getTime()

  useLayoutEffect(() => {
    const years = () => (Date.now() - birthMs) / YEAR_MS
    const paint = () => {
      if (digitsRef.current) digitsRef.current.textContent = years().toFixed(DECIMALS)
    }
    if (spokenRef.current) spokenRef.current.textContent = labels.ageSpoken(Math.floor(years()))

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    paint()
    const timer = window.setInterval(paint, reduce ? 1000 : 100)
    return () => window.clearInterval(timer)
  }, [birthMs])

  return (
    <>
      <span ref={digitsRef} className={className} aria-hidden="true" data-live-age="" />
      <span ref={spokenRef} className="visually-hidden" />
    </>
  )
}
