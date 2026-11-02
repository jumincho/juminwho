/** A tiny shared value with subscribers, e.g. the backbone shown by Figure 3 and Table 2. */
export interface Store<T> {
  get(): T
  set(value: T): void
  subscribe(listener: (value: T) => void): () => void
}

export function store<T>(initial: T): Store<T> {
  let value = initial
  const listeners = new Set<(value: T) => void>()
  return {
    get: () => value,
    set(next) {
      if (Object.is(next, value)) return
      value = next
      for (const listener of listeners) listener(value)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
