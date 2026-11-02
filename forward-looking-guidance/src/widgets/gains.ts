import { backbones, column, datasets, mainResults, type Backbone, type Dataset } from '../data/paper'
import { linear, responsive } from '../lib/chart'
import { segmented } from '../lib/controls'
import { s } from '../lib/dom'
import { delta, score } from '../lib/format'
import { onFirstView, prefersReducedMotion } from '../lib/motion'
import { tween } from '../lib/tween'
import { backbone } from '../state'

/**
 * Figure 3: EM of each compatible planner before (hollow) and after (filled)
 * forward-looking guidance, one panel per benchmark. Each panel has its own
 * axis, fixed across both backbones, so switching backbone moves the dots
 * but never the scale. Every change is drawn as it is, flat and negative ones
 * included.
 */

const METHODS = ['SelfAsk', 'DualRAG', 'STRIDE'] as const

const AXES: Record<Dataset, { domain: [number, number]; ticks: number[] }> = {
  '2wiki': { domain: [0.2, 0.8], ticks: [0.2, 0.4, 0.6, 0.8] },
  hotpotqa: { domain: [0.4, 0.7], ticks: [0.4, 0.5, 0.6, 0.7] },
  musique: { domain: [0.1, 0.4], ticks: [0.1, 0.2, 0.3, 0.4] },
}

interface Pair {
  base: number
  fg: number
}

function pairsFor(b: Backbone): Pair[][] {
  const rows = mainResults[b]
  return datasets.map((d) =>
    METHODS.map((method) => {
      const c = column(d.id, 'em')
      const base = rows.find((row) => row.method === method)
      const fg = rows.find((row) => row.base === method)
      return { base: base?.scores[c] ?? 0, fg: fg?.scores[c] ?? 0 }
    }),
  )
}

interface RowParts {
  line: SVGLineElement
  base: SVGCircleElement
  fg: SVGCircleElement
  value: SVGTextElement
  title: SVGTitleElement
}

const ROW_H = 42
const TOP = 44
const AXIS = 30
const PANEL_H = TOP + METHODS.length * ROW_H + AXIS
const tickLabel = (v: number) => v.toFixed(1).replace(/^0/, '')

export function mountGains(container: HTMLElement, tools: HTMLElement | null): void {
  let rows: RowParts[][] = []
  let scales: ((value: number) => number)[] = []
  let seen = prefersReducedMotion()

  const update = (b: Backbone, animate: boolean) => {
    const label = backbones.find((item) => item.id === b)?.label ?? b
    pairsFor(b).forEach((panel, p) =>
      panel.forEach((pair, r) => {
        const parts = rows[p]?.[r]
        const x = scales[p]
        if (!parts || !x) return
        const d = pair.fg - pair.base
        const tone = Math.round(d * 1000) === 0 ? 'is-zero' : d > 0 ? 'is-pos' : 'is-neg'
        const duration = animate ? 640 : 0
        // Before the figure is first seen, the filled dot waits on the hollow one, then slides out.
        const end = seen ? pair.fg : pair.base
        tween(parts.base, { cx: x(pair.base) }, duration)
        tween(parts.fg, { cx: x(end) }, duration)
        tween(parts.line, { x1: x(pair.base), x2: x(end) }, duration)
        parts.line.setAttribute('class', `gn-line ${tone}`)
        parts.value.textContent = delta(d)
        parts.value.setAttribute('class', `gn-delta ${tone}`)
        parts.title.textContent = `${METHODS[r]} on ${datasets[p].label} with ${label}: EM ${score(pair.base)} → ${score(pair.fg)} (${delta(d)})`
      }),
    )
  }

  const draw = (width: number) => {
    // Wide: three panels side by side, sharing one column of method names. Narrow: stacked.
    const wide = width >= 720
    const labelW = wide ? 82 : 70
    const gap = wide ? 28 : 0
    const deltaW = 50
    const panelW = wide ? (width - labelW - gap * 2) / 3 : width - labelW
    const stackGap = 14
    const height = wide ? PANEL_H : datasets.length * PANEL_H + (datasets.length - 1) * stackGap
    const rowY = (oy: number, r: number) => oy + TOP + r * ROW_H + ROW_H / 2 - 4

    const svg = s('svg', {
      class: 'gn-svg',
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      role: 'img',
      'aria-label':
        'Dot plot of EM before and after forward-looking guidance for SelfAsk, DualRAG and STRIDE on 2WikiMultiHopQA, HotpotQA and MuSiQue. Exact values are in Table 2 below.',
    })

    scales = []
    rows = datasets.map((dataset, p) => {
      const ox = wide ? labelW + p * (panelW + gap) : labelW
      const oy = wide ? 0 : p * (PANEL_H + stackGap)
      const { domain, ticks } = AXES[dataset.id]
      const x = linear(domain, [ox + 10, ox + panelW - deltaW - 12])
      scales[p] = x
      const plotBottom = oy + TOP + METHODS.length * ROW_H - 6

      const panel = s('g', { class: 'gn-panel' })
      panel.append(
        s('text', { class: 'gn-title', x: ox + 10, y: oy + 18 }, dataset.label),
        s('text', { class: 'gn-axis', x: ox + panelW, y: oy + 18, 'text-anchor': 'end' }, 'ΔEM'),
      )
      for (const tick of ticks) {
        panel.append(
          s('line', { class: 'gn-grid', x1: x(tick), x2: x(tick), y1: oy + TOP - 8, y2: plotBottom }),
          s('text', { class: 'gn-tick', x: x(tick), y: plotBottom + 18, 'text-anchor': 'middle' }, tickLabel(tick)),
        )
      }

      const parts = METHODS.map((_, r) => {
        const cy = rowY(oy, r)
        const title = s('title')
        const line = s('line', { class: 'gn-line', x1: x(domain[0]), x2: x(domain[0]), y1: cy, y2: cy })
        const base = s('circle', { class: 'gn-base', cx: x(domain[0]), cy, r: 6 })
        const fg = s('circle', { class: 'gn-fg', cx: x(domain[0]), cy, r: 7 })
        const value = s('text', { class: 'gn-delta', x: ox + panelW, y: cy + 4.5, 'text-anchor': 'end' })
        panel.append(
          s(
            'g',
            { class: 'gn-row' },
            title,
            s('rect', { class: 'gn-hit', x: ox, y: cy - ROW_H / 2, width: panelW, height: ROW_H, rx: 8 }),
            line,
            base,
            fg,
            value,
          ),
        )
        return { line, base, fg, value, title }
      })

      // Method names: once on the left when the panels share rows, per panel when stacked.
      if (!wide || p === 0) {
        METHODS.forEach((method, r) =>
          panel.append(s('text', { class: `gn-method${method === 'STRIDE' ? ' is-strong' : ''}`, x: 0, y: rowY(oy, r) + 4.5 }, method)),
        )
      }
      svg.append(panel)
      return parts
    })
    container.replaceChildren(svg)
    update(backbone.get(), false)
  }

  const control = segmented<Backbone>(
    'Backbone',
    backbones.map((b) => ({ value: b.id, label: b.label })),
    backbone.get(),
    (value) => backbone.set(value),
  )
  tools?.append(control.el)
  backbone.subscribe((value) => {
    control.set(value)
    update(value, true)
  })

  responsive(container, draw)
  if (!seen) {
    onFirstView(container, () => {
      seen = true
      update(backbone.get(), true)
    })
  }
}
