import { useEffect, useState } from 'react'

/**
 * The current time, refreshed just after each full second so a clock built
 * on it turns over with the real one. Only the component using it re-renders.
 */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer = 0
    const schedule = (from: Date) => {
      timer = window.setTimeout(tick, 1010 - from.getMilliseconds())
    }
    const tick = () => {
      const date = new Date()
      setNow(date)
      schedule(date)
    }
    schedule(new Date())
    return () => window.clearTimeout(timer)
  }, [])

  return now
}
