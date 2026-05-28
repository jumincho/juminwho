import { useEffect, useState } from 'react'

interface Props {
  text: string
  speed?: number
  className?: string
  reveal?: boolean
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

export default function ScrambleText({ text, speed = 28, className, reveal = true }: Props) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (!reveal) return
    let raf = 0
    let frame = 0
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = []
    const oldText = display.padEnd(text.length, ' ')
    const length = Math.max(oldText.length, text.length)
    for (let i = 0; i < length; i += 1) {
      const from = oldText[i] || ''
      const to = text[i] || ''
      const start = Math.floor(Math.random() * 22)
      const end = start + Math.floor(Math.random() * 28) + 6
      queue.push({ from, to, start, end })
    }
    function update() {
      let output = ''
      let complete = 0
      for (let i = 0; i < queue.length; i += 1) {
        const q = queue[i]
        if (frame >= q.end) {
          complete += 1
          output += q.to
        } else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = CHARS[Math.floor(Math.random() * CHARS.length)]
          }
          output += q.char
        } else {
          output += q.from
        }
      }
      setDisplay(output)
      if (complete < queue.length) {
        frame += 1
        raf = window.setTimeout(update, 1000 / speed)
      }
    }
    update()
    return () => window.clearTimeout(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reveal])

  return <span className={className}>{display}</span>
}
