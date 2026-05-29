import { useEffect, useRef, useState } from 'react'
import type { ElementType } from 'react'
import { useInView } from 'framer-motion'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01010110$&%@אבגΣΔΦΨΩ語夢知'

interface Props {
  text: string
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div'
  delay?: number
  speed?: number
}

/** Decrypts text into place, left-to-right, when it scrolls into view. */
export default function ScrambleText({ text, className, as = 'span', delay = 0, speed = 28 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  const [out, setOut] = useState(text)

  useEffect(() => {
    if (!inView) return
    // out already defaults to the full text, so reduced-motion users just keep it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let timer = 0
    let rafId = 0
    let cancelled = false
    const total = text.length + 14
    const tick = () => {
      if (cancelled) return
      const progress = frame
      const next = text
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < progress - 8) return ch
          if (i > progress) return ''
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')
      setOut(next)
      frame += 1
      if (frame <= total) timer = window.setTimeout(() => { rafId = requestAnimationFrame(tick) }, speed)
      else setOut(text)
    }
    timer = window.setTimeout(() => { rafId = requestAnimationFrame(tick) }, delay)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      cancelAnimationFrame(rafId)
    }
  }, [inView, text, delay, speed])

  const Tag = as as ElementType
  return (
    <Tag ref={ref} className={className}>
      {out}
    </Tag>
  )
}
