import type { Publication } from '../data/profile'
import { selfNames } from '../data/profile'
import styles from './PublicationList.module.css'

interface Props {
  items: Publication[]
}

function Authors({ names }: { names: string[] }) {
  return (
    <span className={styles.authors}>
      {names.map((name, i) => (
        <span key={name}>
          {selfNames.includes(name) ? <strong className={styles.self}>{name}</strong> : name}
          {i < names.length - 1 && ', '}
        </span>
      ))}
    </span>
  )
}

export default function PublicationList({ items }: Props) {
  return (
    <ol className={styles.list} aria-label="Publications">
      {items.map((pub) => (
        <li key={pub.title} className={styles.item}>
          <span className={styles.year}>{pub.year}</span>
          <div className={styles.detail}>
            <p className={styles.title}>
              {pub.url ? (
                <a href={pub.url} className="link" target="_blank" rel="noopener noreferrer">
                  {pub.title}
                </a>
              ) : (
                pub.title
              )}
            </p>
            <Authors names={pub.authors} />
            <p className={styles.venue}>{pub.venue}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
