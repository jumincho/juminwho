import { useState, type PointerEvent } from 'react'
import { cx } from '../lib/cx'
import styles from './NameFlip.module.css'

interface Props {
  name: string
  alias: string
  /** Show the alias without hover, e.g. once the page has been scrolled. */
  flipped?: boolean
}

/**
 * The name and its "JUMIN WHO?" alias stacked in one grid cell, so the box
 * never changes size. The alias bounces in while a mouse hovers the name or
 * while `flipped` is set. Screen readers always read the real name.
 */
export default function NameFlip({ name, alias, flipped = false }: Props) {
  const [hovered, setHovered] = useState(false)

  const onPointerEnter = (event: PointerEvent) => {
    // A tap would flip and immediately flip back; touch gets the scroll flip only.
    if (event.pointerType !== 'touch') setHovered(true)
  }

  return (
    <span
      className={cx(styles.flip, (flipped || hovered) && styles.showAlias)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => setHovered(false)}
    >
      <span className={cx(styles.face, styles.name)}>{name}</span>
      <span className={cx(styles.face, styles.alias)} aria-hidden="true">
        {alias}
      </span>
    </span>
  )
}
