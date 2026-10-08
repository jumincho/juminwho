import { Moon, Sun } from 'lucide-react'
import { labels } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { toggleTheme } from '../lib/theme'
import styles from './ThemeToggle.module.css'

/** Round button that swaps cream morning for cocoa night. Shows the current theme. */
export default function ThemeToggle() {
  const { t } = useLanguage()
  const theme = useTheme()
  const label = t(theme === 'dark' ? labels.themeToLight : labels.themeToDark)

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => toggleTheme()}
      aria-label={label}
      title={label}
      data-current={theme}
    >
      <Sun className={`${styles.icon} ${styles.sun}`} />
      <Moon className={`${styles.icon} ${styles.moon}`} />
    </button>
  )
}
