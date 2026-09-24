import { languages } from '../data/profile'
import type { Lang, Localized } from '../data/types'

export const DEFAULT_LANG: Lang = 'en'

/**
 * localStorage key for a language picked in the menu. The inline script in
 * index.html reads the same key and parameter before first paint; keep the
 * three in sync.
 */
export const LANG_STORAGE_KEY = 'juminwho:lang'

/** `?lang=ja` opens the page in Japanese without changing the stored choice. */
export const LANG_PARAM = 'lang'

/** Picks one language's value out of a `Localized` one. */
export type Translate = <T>(value: Localized<T>) => T

export const isLang = (value: unknown): value is Lang => languages.some((language) => language.code === value)

/** The address's `?lang=`, else the visitor's last choice, else English. */
export function readInitialLang(): Lang {
  const param = new URLSearchParams(window.location.search).get(LANG_PARAM)
  if (isLang(param)) return param
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (isLang(stored)) return stored
  } catch {
    // Private mode or blocked storage: fall through to the default.
  }
  return DEFAULT_LANG
}

export function storeLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    // The choice simply lasts for this visit.
  }
}

/**
 * Sets <html lang>, which picks the fonts and word breaking for the script,
 * and mirrors the language in the address so a copied link opens the same way.
 */
export function applyLang(lang: Lang): void {
  document.documentElement.lang = lang
  const url = new URL(window.location.href)
  if (lang === DEFAULT_LANG) url.searchParams.delete(LANG_PARAM)
  else url.searchParams.set(LANG_PARAM, lang)
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url)
}
