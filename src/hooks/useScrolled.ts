import { useEffect, useState } from 'react'

/** Scroll distance (px) after which the name reads "JUMIN WHO?". */
export const ALIAS_SCROLL_THRESHOLD = 48

/**
 * True once the page is scrolled past `threshold` pixels. Reads the position
 * once per animation frame and only re-renders when the answer changes.
 */
export function useScrolled(threshold = ALIAS_SCROLL_THRESHOLD): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold])

  return scrolled
}
