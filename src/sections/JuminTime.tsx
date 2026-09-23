import { AlarmClock, Atom, Globe, Laptop, Moon, Sunrise, type LucideIcon } from 'lucide-react'
import { Fragment, useMemo, useState, type CSSProperties } from 'react'
import Mascot from '../components/Mascot'
import Panel, { type Tone } from '../components/Panel'
import PlaceName from '../components/PlaceName'
import { juminTime, profile } from '../data/profile'
import type { RoutineState } from '../data/types'
import { useClockMode } from '../hooks/useClockMode'
import { useNow } from '../hooks/useNow'
import {
  dayRuns,
  hoursMinutes,
  isoString,
  localTimeZone,
  longDate,
  midnightOf,
  seconds,
  statusAt,
  utcLabel,
  wallClock,
  weekdayName,
  zoneAbbreviation,
  zoneLabel,
  type ClockMode,
  type Run,
  type Status,
} from '../lib/clock'
import styles from './JuminTime.module.css'

/** Icon and pastel tone of each state: the status badge, the ribbon and its legend. */
const stateLooks: Record<RoutineState, { icon: LucideIcon; tone: Tone }> = {
  asleep: { icon: Moon, tone: 'sky' },
  ready: { icon: Sunrise, tone: 'peach' },
  working: { icon: Laptop, tone: 'butter' },
  superposition: { icon: Atom, tone: 'lilac' },
}
const legendOrder: RoutineState[] = ['asleep', 'ready', 'working', 'superposition']

const DAY = 24 * 60
const TICKS = ['00', '06', '12', '18', '24']
const clockText = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
const maybe = (state: RoutineState) => `${juminTime.maybe} ${juminTime.states[state].label}`

function ModeSwitch({ mode, onChange }: { mode: ClockMode; onChange: (mode: ClockMode) => void }) {
  return (
    <fieldset className={styles.switch} data-mode={mode}>
      <legend className="visually-hidden">{juminTime.modesLabel}</legend>
      <span className={styles.thumb} aria-hidden="true" />
      {(['local', 'jumin'] as const).map((value) => (
        <span key={value} className={styles.choice}>
          <input
            type="radio"
            id={`clock-${value}`}
            name="clock-mode"
            value={value}
            checked={mode === value}
            onChange={() => onChange(value)}
            className="visually-hidden"
          />
          <label htmlFor={`clock-${value}`} className={styles.option}>
            {value === 'local' ? (
              <Globe className={styles.optionIcon} aria-hidden="true" />
            ) : (
              <Mascot size={20} className={styles.optionIcon} />
            )}
            {juminTime.modes[value]}
          </label>
        </span>
      ))}
    </fieldset>
  )
}

function StatusCard({ status, until }: { status: Status; until: string }) {
  const { states } = status
  return (
    <div className={styles.status} data-status={states.join(' ')}>
      <span className={styles.icons} aria-hidden="true">
        {states.map((state) => {
          const { icon: Icon, tone } = stateLooks[state]
          return (
            <span key={state} className={styles.icon} data-tone={tone} data-state={state}>
              <Icon />
            </span>
          )
        })}
      </span>
      <div>
        <p className={styles.label}>
          {states.map((state, i) => (
            <Fragment key={state}>
              {i > 0 && <span className="visually-hidden">, </span>}
              <span data-tone={stateLooks[state].tone} data-state-label="">
                <span className={styles.maybe}>{juminTime.maybe}</span>{' '}
                <span className={styles.stateWord}>{juminTime.states[state].label}</span>
              </span>
            </Fragment>
          ))}
        </p>
        <p className={styles.hint}>{states.length > 1 ? juminTime.overlapHint : juminTime.states[states[0]].hint}</p>
        <p className={styles.meta}>
          <span className={styles.dayChip}>{status.weekend ? juminTime.days.weekend : juminTime.days.weekday}</span>
          {until}
        </p>
      </div>
    </div>
  )
}

/** Jumin's day as a pastel ribbon on the shown clock, with Mongle standing at "now". */
function DayRibbon({ runs, now, caption }: { runs: Run[]; now: number; caption: string }) {
  const present = legendOrder.filter((state) => runs.some((run) => run.states.includes(state)))
  const summary = runs
    .map((run) => `${clockText(run.from)}–${clockText(run.to)} ${run.states.map(maybe).join(' and ')}`)
    .join(', ')

  return (
    <div className={styles.ribbon}>
      <div className={styles.ribbonHead}>
        <p className={styles.caption}>{caption}</p>
        <p className={styles.legend} aria-hidden="true">
          <span className={styles.maybe}>{juminTime.maybe}</span>
          {present.map((state) => (
            <span key={state} className={styles.key} data-tone={stateLooks[state].tone}>
              <span className={styles.swatch} />
              {juminTime.states[state].label}
            </span>
          ))}
        </p>
      </div>
      <div className={styles.rail}>
        <div className={styles.track} role="img" aria-label={`${caption}: ${summary}`}>
          {runs.map((run) => {
            const [a, b = a] = run.states.map((state) => `var(--${stateLooks[state].tone}-pop)`)
            const style = {
              left: `${(run.from / DAY) * 100}%`,
              width: `${((run.to - run.from) / DAY) * 100}%`,
              '--a': a,
              '--b': b,
            } as CSSProperties
            return <span key={run.from} className={run.states.length > 1 ? `${styles.run} ${styles.overlap}` : styles.run} style={style} />
          })}
        </div>
        <span className={styles.now} style={{ left: `${(now / DAY) * 100}%` }} aria-hidden="true">
          <Mascot size={26} />
        </span>
      </div>
      <div className={styles.ticks} aria-hidden="true">
        {TICKS.map((tick, i) => (
          <span key={tick} style={{ left: `${(i / (TICKS.length - 1)) * 100}%` }}>
            {tick}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * "What time is it for Jumin?": a clock in Jumin's time zone or the visitor's
 * (the Local | Jumin switch), what Jumin is maybe doing, Jumin's day as a
 * ribbon, and how far apart the two clocks are.
 */
export default function JuminTime() {
  const now = useNow()
  const [mode, setMode] = useClockMode()
  const [localZone] = useState(localTimeZone)

  const jumin = wallClock(now, juminTime.timeZone)
  const local = wallClock(now, localZone)
  const shownZone = mode === 'jumin' ? juminTime.timeZone : localZone
  const shown = mode === 'jumin' ? jumin : local
  const other = mode === 'jumin' ? local : jumin
  const otherZone = mode === 'jumin' ? localZone : juminTime.timeZone
  const shownName =
    shownZone === juminTime.timeZone ? juminTime.zoneName : zoneAbbreviation(now, shownZone)

  // Minute-level work: what Jumin is doing, and the ribbon for the shown day.
  const minute = Math.floor(now.getTime() / 60000)
  const status = useMemo(
    () => statusAt(juminTime.routine, new Date(minute * 60000), jumin.offset),
    [minute, jumin.offset],
  )
  const midnight = midnightOf(now, shown)
  const runs = useMemo(() => dayRuns(juminTime.routine, midnight, jumin.offset), [midnight, jumin.offset])

  const until = wallClock(status.until, shownZone)
  const gap = jumin.offset - local.offset

  return (
    <Panel
      id={juminTime.id}
      title={juminTime.title}
      icon={AlarmClock}
      tone="lilac"
      className={styles.root}
      action={<ModeSwitch mode={mode} onChange={setMode} />}
    >
      <div className={styles.board}>
        <div>
          <p className={styles.using}>
            <span className={styles.live} aria-hidden="true" />
            {juminTime.using[mode]}
          </p>
          <time className={styles.time} dateTime={isoString(shown)} data-clock="">
            {hoursMinutes(shown)}
            <span className={styles.seconds}>:{seconds(shown)}</span>
          </time>
          <p className={styles.date}>{longDate(now, shownZone)}</p>
          <p className={styles.place}>
            {mode === 'jumin' ? (
              <PlaceName place={profile.location} />
            ) : (
              <span className={styles.yourZone}>
                <Globe className={styles.globe} aria-hidden="true" />
                {juminTime.yourZone}
              </span>
            )}
          </p>
          <p className={styles.zone}>
            {zoneLabel(shownZone)} · {[shownName, utcLabel(shown.offset)].filter(Boolean).join(', ')}
          </p>
        </div>

        <StatusCard
          status={status}
          until={juminTime.until(`${hoursMinutes(until)} ${shownName ?? utcLabel(shown.offset)}`)}
        />
      </div>

      <DayRibbon
        runs={runs}
        now={shown.hour * 60 + shown.minute + shown.second / 60}
        caption={juminTime.dayCaption[mode]}
      />

      <p className={styles.compare}>
        {gap !== 0 && (
          <>
            <span>{juminTime.elsewhere[mode](hoursMinutes(other), weekdayName(now, otherZone))}</span>{' '}
          </>
        )}
        <span>{juminTime.gap(gap)}</span>
      </p>
    </Panel>
  )
}
