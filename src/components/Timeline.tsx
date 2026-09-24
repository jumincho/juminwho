import { labels } from '../data/profile'
import type { Period, TimelineEntry } from '../data/types'
import { useLanguage } from '../hooks/useLanguage'
import { cx } from '../lib/cx'
import ExternalLink from './ExternalLink'
import styles from './Timeline.module.css'

/** A date pill (`2024.03 – 2026.02`, `2026.03 – present`), plus an "expected" tag for planned end dates. */
function PeriodLabel({ period: { from, to, expected } }: { period: Period }) {
  const { t } = useLanguage()
  return (
    <p className={styles.period}>
      <span className={styles.range}>{`${from} – ${to ?? t(labels.present)}`}</span>
      {expected && (
        <>
          {' '}
          <span className={styles.expected}>{t(labels.expected)}</span>
        </>
      )}
    </p>
  )
}

const isOngoing = ({ to, expected }: Period) => !to || Boolean(expected)

/** Newest-first list of periods joined by a dotted thread; ongoing entries glow. */
export default function Timeline({ items }: { items: TimelineEntry[] }) {
  const { t } = useLanguage()
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li
          key={`${item.period.from}-${item.title.en}`}
          className={cx(styles.item, isOngoing(item.period) && styles.ongoing)}
        >
          <PeriodLabel period={item.period} />
          <span className={styles.rail} aria-hidden="true" />
          <div className={styles.body}>
            <h3 className={styles.title}>{t(item.title)}</h3>
            <p className={styles.org}>{t(item.org)}</p>
            {item.advisor && (
              <p className={styles.note}>
                {t(labels.advisor)} ·{' '}
                <ExternalLink href={item.advisor.href} className="link">
                  {t(item.advisor.label)}
                </ExternalLink>
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
