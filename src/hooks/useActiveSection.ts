import { useEffect, useState } from 'react'
import { subscribeToViewport } from '../lib/subscribe'

/** The last section (in the given order) whose top has passed a line at `lineRatio` of the viewport height. */
function sectionAt(ids: readonly string[], lineRatio: number): string | null {
  const line = window.innerHeight * lineRatio
  let current: string | null = null
  for (const id of ids) {
    const top = document.getElementById(id)?.getBoundingClientRect().top
    if (top !== undefined && top <= line) current = id
  }
  // At the very bottom the last section wins, since a short final section may never reach the line.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (atBottom && window.scrollY > 0 && ids.length > 0) current = ids[ids.length - 1]
  return current
}

/**
 * Scrollspy for the header navigation. Layout is read once per animation
 * frame while the page scrolls or resizes, never during a render.
 */
export function useActiveSection(ids: readonly string[], lineRatio = 0.4): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setActive(sectionAt(ids, lineRatio))
    update()
    return subscribeToViewport(update)
  }, [ids, lineRatio])

  return active
}
