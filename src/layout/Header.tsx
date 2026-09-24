import LanguageMenu from '../components/LanguageMenu'
import Mascot from '../components/Mascot'
import NameFlip from '../components/NameFlip'
import ThemeToggle from '../components/ThemeToggle'
import { labels, profile, sections, type SectionKey } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useLanguage } from '../hooks/useLanguage'
import { useScrolled } from '../hooks/useScrolled'
import { sectionLooks } from '../sections/looks'
import styles from './Header.module.css'

const navItems = (Object.keys(sections) as SectionKey[]).map((key) => ({
  ...sections[key],
  ...sectionLooks[key],
}))
const sectionIds = navItems.map((item) => item.id)

/** Floating pill bar: mascot and name, section links, language menu, theme toggle. */
export default function Header() {
  const { t } = useLanguage()
  const scrolled = useScrolled()
  const active = useActiveSection(sectionIds)

  return (
    <header className={`page ${styles.header}`}>
      <div className={styles.bar}>
        <a href="#top" className={styles.brand} title={t(labels.backToTop)}>
          <Mascot size={32} className={styles.mascot} />
          <span className={styles.brandName}>
            <NameFlip name={profile.name} alias={profile.alias} flipped={scrolled} />
          </span>
        </a>

        <nav className={styles.nav} aria-label={t(labels.navigation)}>
          <ul className={styles.navList}>
            {navItems.map(({ id, nav, icon: Icon, tone }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={styles.navLink}
                  data-tone={tone}
                  aria-current={active === id ? 'location' : undefined}
                >
                  <Icon className={styles.navIcon} />
                  <span className={styles.navLabel}>{t(nav)}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <LanguageMenu />
        <ThemeToggle />
      </div>
    </header>
  )
}
