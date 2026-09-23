import ExternalLink from '../components/ExternalLink'
import Mascot from '../components/Mascot'
import { labels, profile, site } from '../data/profile'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <Mascot size={72} className={styles.mascot} />
        <p className={styles.signOff}>
          <span>{labels.thanks}</span> <span>{labels.signOff}</span>
        </p>
        <p className={styles.meta}>
          © {new Date().getFullYear()} {profile.name} · {labels.lastUpdated} {site.lastUpdated} ·{' '}
          <ExternalLink href={site.source} className="link">
            {labels.source}
          </ExternalLink>
        </p>
      </div>
    </footer>
  )
}
