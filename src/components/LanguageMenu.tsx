import { Check, Languages } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { labels, languages } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage'
import styles from './LanguageMenu.module.css'

/**
 * Round header button opening the language list: region tag, the language's
 * own name, and a check on the current one. A menu of radio items: arrow
 * keys move, Enter picks, Escape or a click outside closes.
 */
export default function LanguageMenu() {
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const current = languages.findIndex((language) => language.code === lang)
  const label = t(labels.language)

  useEffect(() => {
    if (!open) return
    itemRefs.current[current]?.focus()
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, current])

  const close = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const items = itemRefs.current.filter((item) => item !== null)
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    const focus = (next: number) => {
      event.preventDefault()
      items[(next + items.length) % items.length].focus()
    }
    if (event.key === 'ArrowDown') focus(index + 1)
    else if (event.key === 'ArrowUp') focus(index - 1)
    else if (event.key === 'Home') focus(0)
    else if (event.key === 'End') focus(items.length - 1)
    else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') setOpen(false)
  }

  return (
    <div ref={rootRef} className={styles.root} data-tone="lilac">
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="language-menu"
        aria-label={`${label}: ${languages[current].name}`}
        title={label}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <Languages className={styles.icon} />
      </button>
      {open && (
        <ul id="language-menu" role="menu" aria-label={label} className={styles.menu} onKeyDown={onKeyDown}>
          {languages.map((language, i) => (
            <li key={language.code} role="none">
              <button
                ref={(node) => {
                  itemRefs.current[i] = node
                }}
                type="button"
                role="menuitemradio"
                aria-checked={i === current}
                tabIndex={-1}
                className={styles.item}
                onClick={() => {
                  setLang(language.code)
                  close()
                }}
              >
                <span className={styles.region} aria-hidden="true">
                  {language.region}
                </span>
                <span className={styles.name} lang={language.code}>
                  {language.name}
                </span>
                <Check className={styles.check} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
