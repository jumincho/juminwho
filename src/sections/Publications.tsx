import { ArrowUpRight } from 'lucide-react'
import ExternalLink from '../components/ExternalLink'
import Panel from '../components/Panel'
import { publications, selfNames } from '../data/profile'
import type { Publication } from '../data/types'
import { panelProps } from './looks'
import styles from './Publications.module.css'

/** "CIKM 2026" already carries its year; "NTCIR-18" becomes "NTCIR-18 · 2025". */
function venueLabel({ venue, year }: Publication): string {
  return venue.includes(String(year)) ? venue : `${venue} · ${year}`
}

function Authors({ names }: { names: string[] }) {
  return (
    <p className={styles.authors}>
      {names.map((name, i) => (
        <span key={name}>
          {selfNames.includes(name) ? <strong className={styles.self}>{name}</strong> : name}
          {i < names.length - 1 && ', '}
        </span>
      ))}
    </p>
  )
}

export default function Publications() {
  return (
    <Panel {...panelProps('publications')}>
      <ol className={styles.papers}>
        {publications.map((paper) => (
          <li key={paper.title} className={styles.paper}>
            <p className={styles.venue}>{venueLabel(paper)}</p>
            <h3 className={styles.title}>
              {paper.href ? (
                <ExternalLink href={paper.href} className="link">
                  {paper.title}
                  <ArrowUpRight className={styles.arrow} />
                </ExternalLink>
              ) : (
                paper.title
              )}
            </h3>
            <Authors names={paper.authors} />
          </li>
        ))}
      </ol>
    </Panel>
  )
}
