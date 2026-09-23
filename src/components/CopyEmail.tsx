import { Check, Copy, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { labels } from '../data/profile'
import { cx } from '../lib/cx'
import styles from './CopyEmail.module.css'

/**
 * The address as plain, selectable text (deliberately not a mailto: link)
 * with a small button that copies it and says so in a speech bubble.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const addressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      // No clipboard access (insecure context, denied permission): select the
      // address instead so a manual copy is one keystroke away.
      const node = addressRef.current
      const selection = window.getSelection()
      if (!node || !selection) return
      const range = document.createRange()
      range.selectNodeContents(node)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  return (
    <div className={cx(styles.email, copied && styles.copied)}>
      <Mail className={styles.icon} />
      <span ref={addressRef} className={styles.address}>
        {email}
      </span>
      <button type="button" className={styles.button} onClick={copy} aria-label={labels.copyEmail} title={labels.copyEmail}>
        {copied ? <Check /> : <Copy />}
        <span className={styles.bubble} aria-hidden="true">
          {labels.copied}
        </span>
      </button>
      <span className="visually-hidden" role="status">
        {copied ? labels.copiedSpoken : ''}
      </span>
    </div>
  )
}
