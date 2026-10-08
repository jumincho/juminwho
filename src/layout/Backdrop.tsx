import { useEffect, useRef } from 'react'
import { startMochiField } from '../lib/mochi-field'
import styles from './Backdrop.module.css'

/**
 * Pastel blobs drifting slowly behind the page, under a whisper of paper
 * grain. A WebGL shader draws them where the device runs it well
 * (lib/mochi-field.ts); everywhere else the CSS blobs float the same way.
 */
export default function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => (canvasRef.current ? startMochiField(canvasRef.current) : undefined), [])

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={`${styles.blob} ${styles.a}`} />
      <span className={`${styles.blob} ${styles.b}`} />
      <span className={`${styles.blob} ${styles.c}`} />
      <span className={`${styles.blob} ${styles.d}`} />
      <span className={styles.grain} />
    </div>
  )
}
