import styles from './Marquee.module.css'

interface Props {
  items: string[]
  speed?: number
  reverse?: boolean
  className?: string
}

export default function Marquee({ items, speed = 40, reverse, className }: Props) {
  const doubled = [...items, ...items]
  return (
    <div className={`${styles.wrap} ${className ?? ''}`} aria-hidden>
      <div
        className={`${styles.track} ${reverse ? styles.reverse : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className={styles.item}>
            <span className={styles.text}>{item}</span>
            <span className={styles.sep}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
