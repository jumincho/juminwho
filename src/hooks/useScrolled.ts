import { useSyncExternalStore } from 'react'
import { subscribeToViewport } from '../lib/subscribe'

/** Scroll distance (px) after which the name reads "JUMIN WHO?". */
export const ALIAS_SCROLL_THRESHOLD = 48

/** True once the page is scrolled past `threshold` pixels; re-renders only when that answer changes. */
export function useScrolled(threshold = ALIAS_SCROLL_THRESHOLD): boolean {
  return useSyncExternalStore(subscribeToViewport, () => window.scrollY > threshold)
}
