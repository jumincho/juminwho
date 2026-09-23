import { MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './Flag.module.css'

/*
 * Flags drawn on a 24 × 24 grid and shown as round stickers. Emoji flags are
 * not an option: Windows renders them as two letters. National colours are
 * fixed, so they are not tokens. Add a country here when a new place needs it.
 */
const drawings: Record<string, ReactNode> = {
  // Taegukgi, scaled into the circle. Trigrams sit on the flag's diagonals
  // (rotated 56.31° / 123.69°): ☰ geon top left, ☷ gon bottom right,
  // ☲ ri bottom left, ☵ gam top right. Red is above the geon–gon diagonal.
  KR: (
    <>
      <rect width="24" height="24" fill="#ffffff" />
      <g transform="translate(12 12)" stroke="#000000" strokeWidth="0.9">
        <g transform="rotate(-56.31)">
          <path d="M-2.5-7.45h5M-2.5-8.8h5M-2.5-10.15h5" />
          <path d="M-2.5 7.45h2.25m.5 0h2.25M-2.5 8.8h2.25m.5 0h2.25M-2.5 10.15h2.25m.5 0h2.25" />
        </g>
        <g transform="rotate(-123.69)">
          <path d="M-2.5-7.45h5M-2.5-8.8h2.25m.5 0h2.25M-2.5-10.15h5" />
          <path d="M-2.5 7.45h2.25m.5 0h2.25M-2.5 8.8h5M-2.5 10.15h2.25m.5 0h2.25" />
        </g>
        <g transform="rotate(-56.31)" stroke="none">
          <circle r="5.6" fill="#cd2e3a" />
          <path d="M0-5.6A2.8 2.8 0 0 0 0 0a2.8 2.8 0 0 1 0 5.6A5.6 5.6 0 0 1 0-5.6z" fill="#0047a0" />
        </g>
      </g>
    </>
  ),
  IT: (
    <>
      <rect width="8" height="24" fill="#009246" />
      <rect x="8" width="8" height="24" fill="#f4f5f0" />
      <rect x="16" width="8" height="24" fill="#ce2b37" />
    </>
  ),
  JP: (
    <>
      <rect width="24" height="24" fill="#ffffff" />
      <circle cx="12" cy="12" r="6.5" fill="#bc002d" />
    </>
  ),
}

/** Round flag for an ISO 3166-1 alpha-2 code; a map pin when there is no drawing yet. */
export default function Flag({ code }: { code: string }) {
  const drawing = drawings[code.toUpperCase()]
  if (!drawing) return <MapPin className={styles.pin} />
  return (
    <svg className={styles.flag} viewBox="0 0 24 24" aria-hidden="true">
      {drawing}
    </svg>
  )
}
