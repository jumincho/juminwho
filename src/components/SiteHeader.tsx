import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { useScrolled } from '../lib/useScrolled'
import { ALIAS_SCROLL_THRESHOLD } from './Hero'
import styles from './SiteHeader.module.css'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'publications', label: 'Publications' },
  { id: 'contact', label: 'Contact' },
]

export default function SiteHeader() {
  const [active, setActive] = useState<string>('')
  const alias = useScrolled(ALIAS_SCROLL_THRESHOLD)

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#top" className={`${styles.wordmark} ${alias ? styles.wordmarkAlias : ''}`} aria-label={profile.name}>
          <span className={`${styles.wordFace} ${styles.wordPrimary}`} aria-hidden={alias}>
            {profile.name}
          </span>
          <span className={`${styles.wordFace} ${styles.wordAlias}`} aria-hidden={!alias}>
            {profile.alias}
          </span>
        </a>
        <nav aria-label="Sections">
          <ul className={styles.nav}>
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={styles.navLink}
                  aria-current={active === s.id ? 'location' : undefined}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
