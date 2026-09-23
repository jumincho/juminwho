import { Moon, Sun } from 'lucide-react'
import { labels } from '../data/profile'
import { useTheme } from '../hooks/useTheme'
import styles from './ThemeToggle.module.css'

/** Round button that swaps cream morning for cocoa night. Shows the current theme. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const label = theme === 'dark' ? labels.themeToLight : labels.themeToDark

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={label}
      title={label}
      data-current={theme}
    >
      <Sun className={`${styles.icon} ${styles.sun}`} />
      <Moon className={`${styles.icon} ${styles.moon}`} />
    </button>
  )
}
