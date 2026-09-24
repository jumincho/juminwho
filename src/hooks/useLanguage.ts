import { useContext } from 'react'
import { LanguageContext, type LanguageValue } from '../lib/language-context'

/** The page language, a way to change it, and `t()` to pick text out of `Localized` values. */
export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage() needs a <LanguageProvider> above it')
  return value
}
