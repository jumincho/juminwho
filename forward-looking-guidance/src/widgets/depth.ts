import { depthResults } from '../data/paper'
import { linear, responsive } from '../lib/chart'
import { s } from '../lib/dom'
import { delta, int, percent, score } from '../lib/format'
import { onFirstView, prefersReducedMotion } from '../lib/motion'

/**
 * Figure 4: MuSiQue EM by gold reasoning depth (Table 3). The relative gain
 * sits above each group, because it is the number that stays put.
 */

/** A bar with rounded top corners, standing on the baseline. */
function bar(x: number, y: number, w: number, base: number, r = 5): string {
  const k = Math.min(r, (base - y) / 2, w / 2)
  return `M${x} ${base}V${y + k}Q${x} ${y} ${x + k} ${y}H${x + w - k}Q${x + w} ${y} ${x + w} ${y + k}V${base}Z`
}

/** `height` overrides the chart's height (the poster draws it a little shorter). */
export function mountDepth(container: HTMLElement, options: { height?: number } = {}): void {
  const draw = (width: number) => {
    const narrow = width < 560
    const height = options.height ?? (narrow ? 290 : 320)
    const margin = { top: 70, right: 8, bottom: 52, left: 34 }
    const plotBottom = height - margin.bottom
    const y = linear([0, 0.5], [plotBottom, margin.top])

    // Four groups; Overall stands a little apart.
    const slots = depthResults.length + 0.5
    const slot = (width - margin.left - margin.right) / slots
    const groupX = (g: number) => margin.left + slot * (g + (g === depthResults.length - 1 ? 0.5 : 0)) + slot / 2
    const barW = Math.min(52, slot * 0.3)
    const pairGap = 6

    const svg = s('svg', {
      class: 'dp-svg',
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      role: 'img',
      'aria-label': `Grouped bar chart. ${depthResults
        .map((d) => `${d.group}: STRIDE ${score(d.stride)}, STRIDE+FG ${score(d.fg)}, ${percent(d.relative)} relative`)
        .join('; ')}.`,
    })

    svg.append(s('text', { class: 'dp-gain-k', x: 0, y: 26.5 }, narrow ? 'gain' : 'relative gain'))
    for (const tick of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) {
      svg.append(
        s('line', { class: tick === 0 ? 'dp-axis' : 'dp-grid', x1: margin.left, x2: width - margin.right, y1: y(tick), y2: y(tick) }),
        s('text', { class: 'dp-tick', x: margin.left - 8, y: y(tick) + 4, 'text-anchor': 'end' }, tick === 0 ? '0' : score(tick).replace(/0+$/, '')),
      )
    }

    // A quiet band behind Overall, which is not a depth but the sum of them.
    const last = depthResults.length - 1
    svg.append(
      s('rect', {
        class: 'dp-overall-band',
        x: groupX(last) - slot * 0.46,
        y: 4,
        width: slot * 0.92,
        height: plotBottom + 44,
        rx: 14,
      }),
    )

    depthResults.forEach((d, g) => {
      const cx = groupX(g)
      const xs = [cx - pairGap / 2 - barW, cx + pairGap / 2]
      const values = [d.stride, d.fg]
      const group = s('g', { class: 'dp-group', style: `--i:${g}` })
      values.forEach((value, k) => {
        group.append(
          s('path', { class: `dp-bar ${k === 0 ? 'is-base' : 'is-fg'}`, d: bar(xs[k], y(value), barW, plotBottom) }),
          s('text', { class: `dp-value ${k === 0 ? 'is-base' : 'is-fg'}`, x: xs[k] + barW / 2, y: y(value) - 7, 'text-anchor': 'middle' }, score(value)),
        )
      })
      // One row for all groups: the relative gains line up, which is the point.
      const chipY = 22
      const chipW = narrow ? 54 : 62
      group.append(
        s(
          'g',
          { class: 'dp-gain' },
          s('rect', { x: cx - chipW / 2, y: chipY - 11, width: chipW, height: 22, rx: 11 }),
          s('text', { x: cx, y: chipY + 4.5, 'text-anchor': 'middle' }, percent(d.relative)),
        ),
        s('text', { class: 'dp-label', x: cx, y: plotBottom + 22, 'text-anchor': 'middle' }, d.group),
        s('text', { class: 'dp-n', x: cx, y: plotBottom + 39, 'text-anchor': 'middle' }, `n = ${int(d.questions)}`),
        s('title', {}, `${d.group}: STRIDE ${score(d.stride)} → STRIDE+FG ${score(d.fg)} (${delta(d.fg - d.stride)}, ${percent(d.relative)} relative)`),
      )
      svg.append(group)
    })

    container.replaceChildren(svg)
  }

  responsive(container, draw)
  if (prefersReducedMotion()) container.classList.add('is-in')
  else onFirstView(container, () => container.classList.add('is-in'), 0.4)
}
