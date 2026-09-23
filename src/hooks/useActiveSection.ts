import { useEffect, useState } from 'react'

/**
 * Scrollspy: the last section (in the given order) whose top has passed a line
 * at `lineRatio` of the viewport height. At the very bottom of the page the
 * last section wins, since a short final section may never reach the line.
 */
export function useActiveSection(ids: readonly string[], lineRatio = 0.4): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * lineRatio
      let current: string | null = null
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= line) current = id
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom && window.scrollY > 0 && ids.length > 0) current = ids[ids.length - 1]
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, lineRatio])

  return active
}
