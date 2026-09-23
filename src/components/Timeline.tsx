import { labels } from '../data/profile'
import type { Period, TimelineEntry } from '../data/types'
import { cx } from '../lib/cx'
import ExternalLink from './ExternalLink'
import styles from './Timeline.module.css'

/** `2024.03 – 2026.02`, `2026.03 – present`, `2026.03 – 2029.02 (expected)`. */
function PeriodLabel({ period: { from, to, expected } }: { period: Period }) {
  return (
    <p className={styles.period}>
      <span>{`${from} – ${to ?? labels.present}`}</span>
      {expected && (
        <>
          {' '}
          <span>({labels.expected})</span>
        </>
      )}
    </p>
  )
}

const isOngoing = ({ to, expected }: Period) => !to || Boolean(expected)

/** Newest-first list of periods joined by a dotted thread; ongoing entries glow. */
export default function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li
          key={`${item.period.from}-${item.title}`}
          className={cx(styles.item, isOngoing(item.period) && styles.ongoing)}
        >
          <PeriodLabel period={item.period} />
          <span className={styles.rail} aria-hidden="true" />
          <div className={styles.body}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.org}>{item.org}</p>
            {item.advisor && (
              <p className={styles.note}>
                {labels.advisor} ·{' '}
                <ExternalLink href={item.advisor.href} className="link">
                  {item.advisor.label}
                </ExternalLink>
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
