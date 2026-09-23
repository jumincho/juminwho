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

/** English formats, cached: building an Intl.DateTimeFormat is the slow part. */
function format(timeZone: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${timeZone}|${JSON.stringify(options)}`
  let found = formats.get(key)
  if (!found) {
    found = new Intl.DateTimeFormat('en-US', { timeZone, ...options })
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

/** "Thursday, September 24, 2026" */
export const longDate = (date: Date, timeZone: string) =>
  format(timeZone, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date)

/** "Thursday" */
export const weekdayName = (date: Date, timeZone: string) => format(timeZone, { weekday: 'long' }).format(date)

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

/** The instant of 00:00 on the day `clock` is on (off by an hour on a daylight-saving switch day). */
export const midnightOf = (date: Date, clock: WallClock) =>
  date.getTime() - ((clock.hour * 60 + clock.minute) * 60 + clock.second) * 1000 - date.getMilliseconds()

// ---- Jumin's routine ----

const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const isWeekend = (weekday: number) => weekday === 0 || weekday === 6

/**
 * Jumin's states at `minute` (0–1439) of a day that is `weekday` in Jumin's
 * time zone, earliest-started first. Stretches that began yesterday and run
 * past midnight count too. A gap in the routine reads as superposition.
 */
export function statesAt(routine: Routine, weekday: number, minute: number): RoutineState[] {
  const found: { state: RoutineState; start: number }[] = []
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
      if (minute >= start && minute < end) found.push({ state: span.state, start })
    }
  }
  const states = found.sort((a, b) => a.start - b.start).map((f) => f.state)
  return states.length > 0 ? [...new Set(states)] : ['superposition']
}

/** Weekday and minute of the day, `offset` minutes east of UTC. */
function zoneMinute(ms: number, offset: number) {
  const total = Math.floor(ms / 60000) + offset
  const days = Math.floor(total / DAY)
  // 1970-01-01 was a Thursday.
  return { weekday: (((days + 4) % 7) + 7) % 7, minute: total - days * DAY }
}

const sameStates = (a: RoutineState[], b: RoutineState[]) => a.join() === b.join()

export interface Status {
  states: RoutineState[]
  /** Saturday or Sunday on Jumin's calendar. */
  weekend: boolean
  /** When the states next change. */
  until: Date
}

/** What Jumin is maybe doing at `now`, with Jumin's clock `offset` minutes east of UTC. */
export function statusAt(routine: Routine, now: Date, offset: number): Status {
  const minute = now.getTime() - (now.getTime() % 60000)
  const at = (ms: number) => {
    const { weekday, minute: m } = zoneMinute(ms, offset)
    return statesAt(routine, weekday, m)
  }
  const states = at(minute)
  let next = minute + 60000
  for (let step = 0; step < 2 * DAY && sameStates(at(next), states); step++) next += 60000
  return { states, weekend: isWeekend(zoneMinute(minute, offset).weekday), until: new Date(next) }
}

/** A stretch of the shown day, in minutes from its midnight, with Jumin's states during it. */
export interface Run {
  from: number
  to: number
  states: RoutineState[]
}

/** Jumin's states across the 24 hours from `midnight` (of any clock), with Jumin `offset` minutes east of UTC. */
export function dayRuns(routine: Routine, midnight: number, offset: number): Run[] {
  const runs: Run[] = []
  for (let m = 0; m < DAY; m++) {
    const { weekday, minute } = zoneMinute(midnight + m * 60000, offset)
    const states = statesAt(routine, weekday, minute)
    const last = runs.at(-1)
    if (last && sameStates(last.states, states)) last.to = m + 1
    else runs.push({ from: m, to: m + 1, states })
  }
  return runs
}
