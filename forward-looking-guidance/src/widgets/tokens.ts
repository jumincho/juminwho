import { datasets, tokenCosts } from '../data/paper'
import { linear, responsive } from '../lib/chart'
import { h, s } from '../lib/dom'
import { int, percent } from '../lib/format'
import { onFirstView, prefersReducedMotion } from '../lib/motion'

/**
 * Figure 5: LLM tokens per question, split into the extractor and the
 * reasoner (the two modules that read the guidance). Totals and the relative
 * increase sit at the end of each bar.
 */

export function mountTokens(container: HTMLElement, legend: HTMLElement | null): void {
  legend?.append(
    h('span', {}, h('i', { class: 'swatch swatch-base' }), 'STRIDE'),
    h('span', {}, h('i', { class: 'swatch swatch-accent' }), 'STRIDE+FG'),
    h('span', { class: 'tk-key' }, h('i', { class: 'swatch tk-key-ext' }), 'extractor', h('i', { class: 'swatch tk-key-rsn' }), 'reasoner'),
  )

  const draw = (width: number) => {
    const narrow = width < 560
    const labelW = narrow ? 74 : 132
    const endW = narrow ? 92 : 120
    const barH = 24
    const pairGap = 6
    const groupGap = 22
    const top = 6
    const axisH = 30
    const groupH = barH * 2 + pairGap
    const height = top + tokenCosts.length * groupH + (tokenCosts.length - 1) * groupGap + axisH
    const x = linear([0, 4000], [labelW, width - endW])
    const plotBottom = height - axisH + 8

    const svg = s('svg', {
      class: 'tk-svg',
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      role: 'img',
      'aria-label': `Stacked bars of extractor and reasoner tokens per question. ${tokenCosts
        .map((t) => {
          const label = datasets.find((d) => d.id === t.dataset)?.label
          return `${label}: STRIDE ${int(t.extractor[0] + t.reasoner[0])}, STRIDE+FG ${int(t.extractor[1] + t.reasoner[1])}`
        })
        .join('; ')}.`,
    })

    for (const tick of [0, 1000, 2000, 3000, 4000]) {
      svg.append(
        s('line', { class: tick === 0 ? 'tk-axis' : 'tk-grid', x1: x(tick), x2: x(tick), y1: top - 4, y2: plotBottom }),
        s('text', { class: 'tk-tick', x: x(tick), y: height - 6, 'text-anchor': 'middle' }, tick === 0 ? '0' : `${tick / 1000}k`),
      )
    }

    tokenCosts.forEach((cost, g) => {
      const dataset = datasets.find((d) => d.id === cost.dataset)
      const gy = top + g * (groupH + groupGap)
      svg.append(
        s('text', { class: 'tk-dataset', x: 0, y: gy + groupH / 2 + 5 }, narrow ? dataset?.short ?? '' : dataset?.label ?? ''),
      )
      const totals = [cost.extractor[0] + cost.reasoner[0], cost.extractor[1] + cost.reasoner[1]]
      ;[0, 1].forEach((k) => {
        const by = gy + k * (barH + pairGap)
        const ext = cost.extractor[k]
        const rsn = cost.reasoner[k]
        const x0 = x(0)
        const x1 = x(ext)
        const x2 = x(ext + rsn)
        const tone = k === 0 ? 'is-base' : 'is-fg'
        const row = s('g', { class: `tk-row ${tone}`, style: `--i:${g * 2 + k}` })
        const bar = s('g', { class: 'tk-bar' })
        bar.append(
          s('rect', { class: 'tk-ext', x: x0, y: by, width: Math.max(0, x1 - x0 - 1), height: barH, rx: 4 }),
          s('rect', { class: 'tk-rsn', x: x1 + 1, y: by, width: Math.max(0, x2 - x1 - 1), height: barH, rx: 4 }),
        )
        const inside = s('g', { class: 'tk-inside' })
        if (x1 - x0 > 46) inside.append(s('text', { class: 'tk-in is-ext', x: x0 + 9, y: by + barH / 2 + 4.5 }, int(ext)))
        if (x2 - x1 > 38) inside.append(s('text', { class: 'tk-in is-rsn', x: x1 + 8, y: by + barH / 2 + 4.5 }, int(rsn)))
        const total = s('text', { class: 'tk-total', x: x2 + 8, y: by + barH / 2 + 4.5 }, int(totals[k]))
        if (k === 1) {
          total.append(s('tspan', { class: 'tk-pct', dx: 6 }, percent(totals[1] / totals[0] - 1)))
        }
        row.append(
          s('title', {}, `${dataset?.label}, ${k === 0 ? 'STRIDE' : 'STRIDE+FG'}: extractor ${int(ext)}, reasoner ${int(rsn)}, total ${int(totals[k])}`),
          bar,
          inside,
          total,
        )
        svg.append(row)
      })
    })

    container.replaceChildren(svg)
  }

  responsive(container, draw)
  if (prefersReducedMotion()) container.classList.add('is-in')
  else onFirstView(container, () => container.classList.add('is-in'), 0.4)
}
