import ExternalLink from '../components/ExternalLink'
import Mascot from '../components/Mascot'
import { labels, profile, site } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <Mascot size={72} className={styles.mascot} />
        <p className={styles.signOff}>
          <span>{t(labels.thanks)}</span> <span>{t(labels.signOff)}</span>
        </p>
        <p className={styles.meta}>
          © {new Date().getFullYear()} {profile.name} · {t(labels.lastUpdated)} {site.lastUpdated} ·{' '}
          <ExternalLink href={site.source} className="link">
            {t(labels.source)}
          </ExternalLink>
        </p>
      </div>
    </footer>
  )
}
