import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './Panel.module.css'

export type Tone = 'peach' | 'butter' | 'sage' | 'sky' | 'lilac' | 'rose'

interface Props {
  id: string
  title: string
  icon: LucideIcon
  tone: Tone
  children: ReactNode
}

/** A page section drawn as a soft pastel cushion with an icon badge and heading. */
export default function Panel({ id, title, icon: Icon, tone, children }: Props) {
  const headingId = `${id}-title`
  return (
    <section id={id} className={styles.panel} data-tone={tone} aria-labelledby={headingId}>
      <div className={styles.head}>
        <span className={styles.badge} aria-hidden="true">
          <Icon />
        </span>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}
