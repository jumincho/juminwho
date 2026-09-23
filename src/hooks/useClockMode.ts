import { useCallback, useState } from 'react'
import { readStoredClockMode, storeClockMode, type ClockMode } from '../lib/clock'

/** Which clock the time card reads in: Jumin's (the default) or the visitor's. Remembered per browser. */
export function useClockMode(): [ClockMode, (mode: ClockMode) => void] {
  const [mode, setMode] = useState<ClockMode>(() => readStoredClockMode() ?? 'jumin')

  const choose = useCallback((next: ClockMode) => {
    storeClockMode(next)
    setMode(next)
  }, [])

  return [mode, choose]
}
