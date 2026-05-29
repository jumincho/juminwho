import styles from './InteractiveBackground.module.css'

/** A lightweight, CSS-only aurora used behind the dark blog reading view. */
export default function InteractiveBackground() {
  return (
    <div className={styles.bg} aria-hidden="true">
      <div className={`${styles.blob} ${styles.b1}`} />
      <div className={`${styles.blob} ${styles.b2}`} />
      <div className={`${styles.blob} ${styles.b3}`} />
      <div className={styles.grid} />
      <div className={styles.vignette} />
    </div>
  )
}
