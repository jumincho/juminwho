/**
 * Browser events as subscriptions for useSyncExternalStore: every component
 * reading the scroll position or a media query shares one listener.
 */

const viewportListeners = new Set<() => void>()
let frame = 0

const notifyViewport = () => {
  frame = 0
  for (const listener of viewportListeners) listener()
}

const onViewportChange = () => {
  if (!frame) frame = requestAnimationFrame(notifyViewport)
}

/** Calls `listener` at most once per animation frame while the page scrolls or resizes. */
export function subscribeToViewport(listener: () => void): () => void {
  if (viewportListeners.size === 0) {
    window.addEventListener('scroll', onViewportChange, { passive: true })
    window.addEventListener('resize', onViewportChange)
  }
  viewportListeners.add(listener)
  return () => {
    viewportListeners.delete(listener)
    if (viewportListeners.size > 0) return
    window.removeEventListener('scroll', onViewportChange)
    window.removeEventListener('resize', onViewportChange)
    cancelAnimationFrame(frame)
    frame = 0
  }
}

const mediaSubscriptions = new Map<string, (listener: () => void) => () => void>()

/** A subscription to one media query; the same function every time for the same query. */
export function subscribeToMedia(query: string): (listener: () => void) => () => void {
  let subscribe = mediaSubscriptions.get(query)
  if (!subscribe) {
    subscribe = (listener) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
    mediaSubscriptions.set(query, subscribe)
  }
  return subscribe
}
