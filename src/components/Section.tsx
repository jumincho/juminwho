import type { ReactNode } from 'react'
import styles from './Section.module.css'

interface Props {
  id: string
  title: string
  children: ReactNode
}

/** Two-column section: a sticky sentence-case heading on the left, content on the right. */
export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className={`wrap ${styles.section}`} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={styles.title}>
        {title}
      </h2>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
