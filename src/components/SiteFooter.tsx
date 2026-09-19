import { lastUpdated, profile } from '../data/profile'
import styles from './SiteFooter.module.css'

export default function SiteFooter() {
  return (
    <footer className={`wrap ${styles.footer}`}>
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p className={styles.meta}>
        Last updated {lastUpdated} ·{' '}
        <a href="https://github.com/jumincho/juminwho" className="link" target="_blank" rel="noopener noreferrer">
          Source
        </a>
      </p>
    </footer>
  )
}
