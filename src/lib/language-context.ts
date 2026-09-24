import { createContext } from 'react'
import type { Lang } from '../data/types'
import type { Translate } from './i18n'

export interface LanguageValue {
  lang: Lang
  /** Switches the page and remembers the choice. */
  setLang: (lang: Lang) => void
  t: Translate
}

/** Filled by <LanguageProvider>; read it with useLanguage(). */
export const LanguageContext = createContext<LanguageValue | null>(null)
