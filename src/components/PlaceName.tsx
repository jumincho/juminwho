import type { Place } from '../data/types'
import { cx } from '../lib/cx'
import Flag from './Flag'
import styles from './PlaceName.module.css'

/** "Rome, Italy" with the country's round flag in front. */
export default function PlaceName({ place, className }: { place: Place; className?: string }) {
  return (
    <span className={cx(styles.place, className)}>
      <Flag code={place.countryCode} />
      {`${place.city}, ${place.country}`}
    </span>
  )
}
