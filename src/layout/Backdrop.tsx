import styles from './Backdrop.module.css'

/** Pastel blobs drifting slowly behind the page, under a whisper of paper grain. */
export default function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <span className={`${styles.blob} ${styles.a}`} />
      <span className={`${styles.blob} ${styles.b}`} />
      <span className={`${styles.blob} ${styles.c}`} />
      <span className={`${styles.blob} ${styles.d}`} />
      <span className={styles.grain} />
    </div>
  )
}
