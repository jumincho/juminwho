import { AlarmClock, Atom, Globe, Laptop, Moon, Sunrise, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import Mascot from '../components/Mascot'
import Panel, { type Tone } from '../components/Panel'
import { juminTime, languages } from '../data/profile'
import type { RoutineState } from '../data/types'
import { useClockMode } from '../hooks/useClockMode'
import { useLanguage } from '../hooks/useLanguage'
import { useNow } from '../hooks/useNow'
import {
  hoursMinutes,
  isoString,
  localTimeZone,
  longDate,
  seconds,
  statusAt,
  utcLabel,
  wallClock,
  zoneAbbreviation,
  zoneLabel,
  type ClockMode,
  type Status,
} from '../lib/clock'
import styles from './JuminTime.module.css'

/** Icon and pastel tone of each state on the status card. */
const stateLooks: Record<RoutineState, { icon: LucideIcon; tone: Tone }> = {
  asleep: { icon: Moon, tone: 'sky' },
  ready: { icon: Sunrise, tone: 'peach' },
  working: { icon: Laptop, tone: 'butter' },
  superposition: { icon: Atom, tone: 'lilac' },
}

function ModeSwitch({ mode, onChange }: { mode: ClockMode; onChange: (mode: ClockMode) => void }) {
  const { t } = useLanguage()
  return (
    <fieldset className={styles.switch} data-mode={mode}>
      <legend className="visually-hidden">{t(juminTime.modesLabel)}</legend>
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
            {t(juminTime.modes[value])}
          </label>
        </span>
      ))}
    </fieldset>
  )
}

function StatusCard({ status: { state, weekend } }: { status: Status }) {
  const { t } = useLanguage()
  const { icon: Icon, tone } = stateLooks[state]
  return (
    <div className={styles.status} data-tone={tone} data-status={state}>
      <span className={styles.icon} data-state={state} aria-hidden="true">
        <Icon />
      </span>
      <div>
        <p className={styles.label} data-state-label="">
          <span className={styles.maybe}>{t(juminTime.maybe)}</span>{' '}
          <span className={styles.stateWord}>{t(juminTime.states[state].label)}</span>
        </p>
        <p className={styles.hint}>{t(juminTime.states[state].hint)}</p>
        <p className={styles.day}>{t(weekend ? juminTime.days.weekend : juminTime.days.weekday)}</p>
      </div>
    </div>
  )
}

/**
 * "What time is it for Jumin?": a clock in Jumin's time zone or the visitor's
 * (the Local | Jumin switch), and what Jumin is maybe doing right now. The
 * state comes from Jumin's routine, which the card never shows.
 */
export default function JuminTime() {
  const { lang, t } = useLanguage()
  const now = useNow()
  const [mode, setMode] = useClockMode()
  const [localZone] = useState(localTimeZone)
  const locale = languages.find((language) => language.code === lang)!.locale

  const jumin = wallClock(now, juminTime.timeZone)
  const shownZone = mode === 'jumin' ? juminTime.timeZone : localZone
  const shown = mode === 'jumin' ? jumin : wallClock(now, localZone)
  const shownName = shownZone === juminTime.timeZone ? juminTime.zoneName : zoneAbbreviation(now, shownZone)

  return (
    <Panel
      id={juminTime.id}
      title={t(juminTime.title)}
      icon={AlarmClock}
      tone="lilac"
      className={styles.root}
      action={<ModeSwitch mode={mode} onChange={setMode} />}
    >
      <div className={styles.board}>
        <div>
          <p className={styles.using}>
            <span className={styles.live} aria-hidden="true" />
            {t(juminTime.using[mode])}
          </p>
          <time className={styles.time} dateTime={isoString(shown)} data-clock="">
            {hoursMinutes(shown)}
            <span className={styles.seconds}>:{seconds(shown)}</span>
          </time>
          <p className={styles.date}>{longDate(now, shownZone, locale)}</p>
          <p className={styles.zone}>
            {zoneLabel(shownZone)} · {[shownName, utcLabel(shown.offset)].filter(Boolean).join(', ')}
          </p>
        </div>

        <StatusCard status={statusAt(juminTime.routine, jumin)} />
      </div>
    </Panel>
  )
}
