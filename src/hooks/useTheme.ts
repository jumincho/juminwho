import { useSyncExternalStore } from 'react'
import { readTheme, subscribeToTheme, type Theme } from '../lib/theme'

/** The theme on screen, kept current whether the toggle or the operating system changed it. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeToTheme, readTheme)
}
