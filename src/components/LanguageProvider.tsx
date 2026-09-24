import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang, Localized } from '../data/types'
import { applyLang, readInitialLang, storeLang } from '../lib/i18n'
import { LanguageContext, type LanguageValue } from '../lib/language-context'

/**
 * Holds the page language: `?lang=` or the stored choice on arrival, English
 * otherwise. Korean pulls in the full Jua subset for its headings on demand;
 * other visitors only ever load the three characters of 조주민.
 */
export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readInitialLang)

  useLayoutEffect(() => applyLang(lang), [lang])

  useEffect(() => {
    if (lang === 'ko') void import('virtual:hangul-font-ko.css')
  }, [lang])

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      setLang: (next) => {
        storeLang(next)
        setLang(next)
      },
      t: <T,>(localized: Localized<T>) => localized[lang],
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
