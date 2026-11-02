/**
 * Charts draw at the real pixel width of their container, so text stays the
 * same size on a phone and on a desktop. `draw(width)` runs on mount and again
 * whenever the width changes.
 */
export function responsive(container: HTMLElement, draw: (width: number) => void): void {
  let last = 0
  const run = () => {
    // The content box: the chart sits inside the container's padding.
    const style = getComputedStyle(container)
    const width = Math.floor(container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight))
    // Below this the container is mid-layout (or hidden); a chart drawn now would be nonsense.
    if (width < 200 || width === last) return
    last = width
    draw(width)
  }
  run()
  if (typeof ResizeObserver === 'function') new ResizeObserver(run).observe(container)
  else addEventListener('resize', run)
}

/** A linear scale from a domain to a range. */
export const linear =
  ([d0, d1]: [number, number], [r0, r1]: [number, number]) =>
  (value: number) =>
    r0 + ((value - d0) / (d1 - d0)) * (r1 - r0)
