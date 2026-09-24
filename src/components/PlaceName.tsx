import { labels } from '../data/profile'
import type { Place } from '../data/types'
import { useLanguage } from '../hooks/useLanguage'
import { cx } from '../lib/cx'
import Flag from './Flag'
import styles from './PlaceName.module.css'

/** "Rome, Italy" (or "イタリア・ローマ", …) with the country's round flag in front. */
export default function PlaceName({ place, className }: { place: Place; className?: string }) {
  const { t } = useLanguage()
  return (
    <span className={cx(styles.place, className)}>
      <Flag code={place.countryCode} />
      {t(labels.place)(t(place.city), t(place.country))}
    </span>
  )
}
