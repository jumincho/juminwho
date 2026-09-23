import { MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './Flag.module.css'

/*
 * Flags drawn on a 24 × 24 grid and shown as round stickers. Emoji flags are
 * not an option: Windows renders them as two letters. National colours are
 * fixed, so they are not tokens. Add a country here when a new venue needs it.
 */
const drawings: Record<string, ReactNode> = {
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
