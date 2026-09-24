import type { Routine, RoutineState } from '../data/types'

/** Minutes in a day. */
const DAY = 24 * 60
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export type ClockMode = 'local' | 'jumin'

/** localStorage key for the visitor's Local/Jumin choice. */
export const CLOCK_STORAGE_KEY = 'juminwho:clock'

export function readStoredClockMode(): ClockMode | null {
  try {
    const value = localStorage.getItem(CLOCK_STORAGE_KEY)
    return value === 'local' || value === 'jumin' ? value : null
  } catch {
    return null
  }
}

export function storeClockMode(mode: ClockMode): void {
  try {
    localStorage.setItem(CLOCK_STORAGE_KEY, mode)
  } catch {
    // Private mode or blocked storage: the choice simply lasts for this visit.
  }
}

/** The visitor's IANA time zone, e.g. "America/Los_Angeles". */
export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

// ---- wall clocks ----

/** A moment as the wall clock of one time zone shows it. */
export interface WallClock {
  year: number
  month: number
  day: number
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number
  hour: number
  minute: number
  second: number
  /** Minutes east of UTC at this moment. */
  offset: number
}

const formats = new Map<string, Intl.DateTimeFormat>()

/**
 * Cached formats, English unless a locale is given: building an
 * Intl.DateTimeFormat is the slow part.
 */
function format(timeZone: string, options: Intl.DateTimeFormatOptions, locale = 'en-US'): Intl.DateTimeFormat {
  const key = `${locale}|${timeZone}|${JSON.stringify(options)}`
  let found = formats.get(key)
  if (!found) {
    found = new Intl.DateTimeFormat(locale, { timeZone, ...options })
    formats.set(key, found)
  }
  return found
}

export function wallClock(date: Date, timeZone: string): WallClock {
  const parts = format(timeZone, {
    hourCycle: 'h23',
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ''
  const [year, month, day, hour, minute, second] = (['year', 'month', 'day', 'hour', 'minute', 'second'] as const).map(
    (type) => Number(part(type)),
  )
  const wholeSeconds = Math.floor(date.getTime() / 1000) * 1000
  const offset = Math.round((Date.UTC(year, month - 1, day, hour % 24, minute, second) - wholeSeconds) / 60000)
  return { year, month, day, weekday: WEEKDAYS.indexOf(part('weekday')), hour: hour % 24, minute, second, offset }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** "09:05" */
export const hoursMinutes = (clock: WallClock) => `${pad(clock.hour)}:${pad(clock.minute)}`

/** "05" */
export const seconds = (clock: WallClock) => pad(clock.second)

/** "2026-09-24T01:46:52+09:00", for <time dateTime>. */
export function isoString(clock: WallClock): string {
  const sign = clock.offset < 0 ? '-' : '+'
  const abs = Math.abs(clock.offset)
  return (
    `${clock.year}-${pad(clock.month)}-${pad(clock.day)}T${hoursMinutes(clock)}:${seconds(clock)}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  )
}

/** "UTC+9", "UTC−7", "UTC+5:30" */
export function utcLabel(offset: number): string {
  const abs = Math.abs(offset)
  return `UTC${offset < 0 ? '−' : '+'}${Math.floor(abs / 60)}${abs % 60 ? `:${pad(abs % 60)}` : ''}`
}

/** "Thursday, September 24, 2026", or the same date the way `locale` writes it ("2026年9月24日木曜日"). */
export const longDate = (date: Date, timeZone: string, locale?: string) =>
  format(timeZone, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }, locale).format(date)

/** Zones some browsers still report by their old names. */
const RENAMED_ZONES: Record<string, string> = {
  'Asia/Calcutta': 'Asia/Kolkata',
  'Asia/Katmandu': 'Asia/Kathmandu',
  'Asia/Rangoon': 'Asia/Yangon',
  'Asia/Saigon': 'Asia/Ho_Chi_Minh',
  'Europe/Kiev': 'Europe/Kyiv',
}

/** "America/Los Angeles": the zone's current name, readable. */
export const zoneLabel = (timeZone: string) => (RENAMED_ZONES[timeZone] ?? timeZone).replace(/_/g, ' ')

/**
 * "PDT" or "CET" when the browser knows a lettered name, otherwise null (it
 * would say "GMT+2"). Null for UTC itself, whose zone name already says it.
 */
export function zoneAbbreviation(date: Date, timeZone: string): string | null {
  const name = format(timeZone, { timeZoneName: 'short' })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value
  return name && name !== 'UTC' && /^[A-Z]{2,5}$/.test(name) ? name : null
}

// ---- Jumin's routine ----

const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const isWeekend = (weekday: number) => weekday === 0 || weekday === 6

/**
 * What Jumin is maybe doing at `minute` (0–1439) of a day that is `weekday`
 * in Jumin's time zone. Yesterday's stretches that run past midnight count
 * too. Where stretches overlap the one that started last wins, and a gap in
 * the routine reads as superposition.
 */
export function stateAt(routine: Routine, weekday: number, minute: number): RoutineState {
  let found: { state: RoutineState; start: number } | null = null
  const days = [
    { spans: isWeekend(weekday) ? routine.weekend : routine.weekday, shift: 0 },
    { spans: isWeekend((weekday + 6) % 7) ? routine.weekend : routine.weekday, shift: -DAY },
  ]
  for (const { spans, shift } of days) {
    for (const span of spans) {
      const from = minutesOf(span.from)
      const to = minutesOf(span.to)
      const start = from + shift
      const end = (to > from ? to : to + DAY) + shift
      if (minute >= start && minute < end && (!found || start > found.start)) found = { state: span.state, start }
    }
  }
  return found?.state ?? 'superposition'
}

export interface Status {
  state: RoutineState
  /** Saturday or Sunday on Jumin's calendar. */
  weekend: boolean
}

/** What Jumin is maybe doing when Jumin's own clock reads `clock`. */
export function statusAt(routine: Routine, clock: WallClock): Status {
  return { state: stateAt(routine, clock.weekday, clock.hour * 60 + clock.minute), weekend: isWeekend(clock.weekday) }
}
