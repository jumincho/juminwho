/** Shapes of the content in `profile.ts`. */

export interface Link {
  label: string
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
  title: string
  org: string
  advisor?: Link
}

/** A city, shown with its country's flag: where Jumin is based, or where a conference took place. */
export interface Place {
  city: string
  country: string
  /** ISO 3166-1 alpha-2 code; picks the flag drawn next to the city. */
  countryCode: string
}

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
  title: string
  org: string
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

/** Monday to Friday, and Saturday and Sunday. Where two stretches overlap, both states hold. */
export interface Routine {
  weekday: RoutineSpan[]
  weekend: RoutineSpan[]
}

export interface SectionMeta {
  id: string
  title: string
  /** Shorter label for the header navigation. */
  nav: string
}
