import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import styles from './Panel.module.css'

export type Tone = 'peach' | 'butter' | 'sage' | 'sky' | 'lilac' | 'rose'

interface Props {
  id: string
  title: string
  icon: LucideIcon
  tone: Tone
  /** A control at the end of the heading row, e.g. a switch. Wraps below the title on narrow screens. */
  action?: ReactNode
  className?: string
  children: ReactNode
}

/** A page section drawn as a soft pastel cushion with an icon badge and heading. */
export default function Panel({ id, title, icon: Icon, tone, action, className, children }: Props) {
  const headingId = `${id}-title`
  return (
    <section id={id} className={cx(styles.panel, className)} data-tone={tone} aria-labelledby={headingId}>
      <div className={cx(styles.head, action !== undefined && styles.withAction)}>
        <span className={styles.badge} aria-hidden="true">
          <Icon />
        </span>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {children}
    </section>
  )
}
