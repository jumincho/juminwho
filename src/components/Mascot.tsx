import { useId, useMemo, type CSSProperties } from 'react'
import drawing from '../../public/favicon.svg?raw'
import { cx } from '../lib/cx'
import styles from './Mascot.module.css'

const viewBox = /viewBox="([^"]+)"/.exec(drawing)?.[1] ?? '0 0 64 64'
/** What is inside the root <svg>, without comments. */
const inner = drawing
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '')
  .trim()

interface Props {
  size: number
  className?: string
}

/**
 * Mongle, the site mascot: the favicon drawing, inlined so it can blink, sway
 * its sprout and squish under the pointer. Each copy gets its own gradient id
 * and blinks on its own beat. Decoration only.
 */
export default function Mascot({ size, className }: Props) {
  const id = `mongle${useId().replace(/[^\w-]/g, '')}`
  const markup = useMemo(
    () => `<g class="${styles.body}">${inner.replace(/(id="|url\(#)([\w-]+)/g, `$1${id}-$2`)}</g>`,
    [id],
  )
  const beat = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 7
  return (
    <svg
      className={cx(styles.mascot, className)}
      viewBox={viewBox}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ '--blink-delay': `${-beat * 0.8}s` } as CSSProperties}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
