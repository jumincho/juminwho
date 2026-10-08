import { useSyncExternalStore } from 'react'
import { prefersReducedMotion, REDUCED_MOTION } from '../lib/motion'
import { subscribeToMedia } from '../lib/subscribe'

/** True while the visitor asks for reduced motion; follows changes to the setting live. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeToMedia(REDUCED_MOTION), prefersReducedMotion)
}
