import type { Entry } from '../data/profile'
import styles from './EntryList.module.css'

interface Props {
  items: Entry[]
  label: string
}

/** Chronological list. Period in a fixed left column, details on the right. */
export default function EntryList({ items, label }: Props) {
  const hasPeriod = items.some((item) => item.period !== '')
  return (
    <ol className={styles.list} aria-label={label}>
      {items.map((item) => (
        <li key={`${item.title}-${item.period}`} className={`${styles.item} ${hasPeriod ? '' : styles.noPeriod}`}>
          {hasPeriod && <span className={styles.period}>{item.period}</span>}
          <span className={styles.detail}>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.org}>{item.org}</span>
            {(item.note || item.noteLink) && (
              <span className={styles.note}>
                {item.note}
                {item.noteLink && (
                  <a href={item.noteLink.url} className="link" target="_blank" rel="noopener noreferrer">
                    {item.noteLink.text}
                  </a>
                )}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  )
}
