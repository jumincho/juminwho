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

export interface Publication {
  title: string
  /** Complete author list in the published order. */
  authors: string[]
  venue: string
  year: number
  /** Primary source: publisher PDF or proceedings page. */
  href?: string
}

export interface Honor {
  title: string
  org: string
}

export interface SectionMeta {
  id: string
  title: string
  /** Shorter label for the header navigation. */
  nav: string
}
