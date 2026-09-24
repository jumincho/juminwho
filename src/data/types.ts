/** Shapes of the content in `profile.ts`. */

/** The languages the site speaks, in menu order; English is the default. */
export type Lang = 'en' | 'zh-CN' | 'zh-HK' | 'ja' | 'ko'

/**
 * One value per language: usually text, sometimes a function that builds it.
 * Every language is required, so a missing translation fails the type check.
 */
export type Localized<T = string> = Record<Lang, T>

export interface Language {
  code: Lang
  /** Region tag shown in front of the name in the language menu, e.g. "JP". */
  region: string
  /** The language's own name, e.g. "日本語". */
  name: string
  /** Locale for dates, e.g. "ja-JP". */
  locale: string
}

/** A link whose label is a proper name (`string`) or translated (`Localized`). */
export interface Link<Label = string> {
  label: Label
  href: string
}

/** Months written as `YYYY.MM`. A missing `to` means the entry is still going on. */
export interface Period {
  from: string
  to?: string
  /** `to` is a planned date, e.g. an expected graduation. */
  expected?: boolean
}

export interface TimelineEntry {
  period: Period
  title: Localized
  org: Localized
  advisor?: Link<Localized>
}

/** A city, shown with its country's flag: where Jumin is based, or where a conference took place. */
export interface Place {
  city: Localized
  country: Localized
  /** ISO 3166-1 alpha-2 code; picks the flag drawn next to the city. */
  countryCode: string
}

/** Titles, authors and venues stay as published, in English. */
export interface Publication {
  title: string
  /** Complete author list in the published order. */
  authors: string[]
  venue: string
  year: number
  place?: Place
  /** Primary source: publisher PDF or proceedings page. */
  href?: string
}

export interface Honor {
  title: Localized
  org: Localized
}

/** What Jumin is maybe doing; the wording lives in `juminTime.states`. */
export type RoutineState = 'asleep' | 'ready' | 'working' | 'superposition'

/**
 * One stretch of Jumin's day, in Jumin's time zone, from `from` up to `to`
 * ("HH:MM"). A `to` at or before `from` runs past midnight; the stretch still
 * belongs to the day it starts on, so Friday's evening lasts into Saturday.
 */
export interface RoutineSpan {
  from: string
  to: string
  state: RoutineState
}

/** Monday to Friday, and Saturday and Sunday. Where stretches overlap, the one that started last wins. */
export interface Routine {
  weekday: RoutineSpan[]
  weekend: RoutineSpan[]
}

export interface SectionMeta {
  id: string
  title: Localized
  /** Shorter label for the header navigation. */
  nav: Localized
}
