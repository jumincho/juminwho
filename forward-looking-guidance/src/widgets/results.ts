import { backbones, datasets, mainResults, metrics, type Backbone, type Dataset, type ResultRow } from '../data/paper'
import { segmented, toggle } from '../lib/controls'
import { h, html } from '../lib/dom'
import { delta, score } from '../lib/format'
import { backbone } from '../state'

/**
 * Table 2, rebuilt from the data: best results bold and second-best
 * underlined within each backbone (computed, and identical to the paper's
 * marks). The change switch shows each +FG variant against the method it
 * extends. Narrow screens show one benchmark at a time.
 */

/** Indices of the best and second-best value in each of the 12 columns. */
function ranks(rows: ResultRow[]): { best: number; second: number }[] {
  return rows[0].scores.map((_, c) => {
    const values = [...new Set(rows.map((row) => row.scores[c]))].sort((a, b) => b - a)
    return { best: values[0], second: values[1] }
  })
}

function methodName(row: ResultRow): string {
  return row.base ? `${row.base}<span class="fg">+FG</span>` : row.method
}

export function mountResults(container: HTMLElement, tools: HTMLElement | null): void {
  const table = h('table', { class: 'results' })
  const caption = h('caption', { class: 'visually-hidden' })
  const head = h('thead')
  const body = h('tbody')
  table.append(caption, head, body)

  const top = h('tr', {}, h('th', { scope: 'col', rowspan: 2, class: 'results-method' }, 'Method'))
  const sub = h('tr')
  for (const dataset of datasets) {
    top.append(
      h(
        'th',
        { scope: 'colgroup', colspan: 4, 'data-ds': dataset.id, class: 'results-ds' },
        h('span', { class: 'long' }, dataset.label),
        h('span', { class: 'short' }, dataset.short),
      ),
    )
    metrics.forEach((metric, m) => sub.append(h('th', { scope: 'col', 'data-ds': dataset.id, class: m === 0 ? 'ds-start' : '' }, metric.label)))
  }
  head.append(top, sub)

  let showDelta = false
  const render = (b: Backbone) => {
    const rows = mainResults[b]
    const marks = ranks(rows)
    const label = backbones.find((item) => item.id === b)?.label ?? b
    caption.textContent = `Table 2: main results with ${label}. Best results are bold and second-best underlined.`
    body.replaceChildren()
    rows.forEach((row, r) => {
      if (row.base && !rows[r - 1]?.base) {
        body.append(
          h('tr', { class: 'results-group' }, h('th', { colspan: 13, scope: 'rowgroup' }, 'With forward-looking guidance (ours)')),
        )
      }
      const base = row.base ? rows.find((other) => other.method === row.base) : undefined
      const tr = h('tr', { class: row.base ? 'is-fg' : '' })
      const th = h('th', { scope: 'row' })
      th.append(html(methodName(row)))
      tr.append(th)
      row.scores.forEach((value, c) => {
        const dataset = datasets[Math.floor(c / 4)].id
        const classes = [c % 4 === 0 ? 'ds-start' : '', value === marks[c].best ? 'best' : value === marks[c].second ? 'second' : '']
        const td = h('td', { 'data-ds': dataset, class: classes.filter(Boolean).join(' ') }, h('span', { class: 'v' }, score(value)))
        if (base) {
          const d = value - base.scores[c]
          const tone = Math.round(d * 1000) === 0 ? 'is-zero' : d > 0 ? 'is-pos' : 'is-neg'
          td.append(h('span', { class: `d ${tone}` }, delta(d)))
        }
        tr.append(td)
      })
      body.append(tr)
    })
  }

  const wrap = h('div', { class: 'results-scroll', 'data-ds': datasets[0].id, tabindex: 0, role: 'region', 'aria-label': 'Table 2, scrollable' })
  wrap.append(table)
  container.append(wrap)

  const backboneControl = segmented<Backbone>(
    'Backbone',
    backbones.map((b) => ({ value: b.id, label: b.label })),
    backbone.get(),
    (value) => backbone.set(value),
  )
  const datasetControl = segmented<Dataset>(
    'Benchmark',
    datasets.map((d) => ({ value: d.id, label: d.short })),
    datasets[0].id,
    (value) => wrap.setAttribute('data-ds', value),
  )
  datasetControl.el.classList.add('results-ds-control')
  const deltaSwitch = toggle('Show change', showDelta, (on) => {
    showDelta = on
    table.classList.toggle('show-delta', on)
  })
  tools?.append(backboneControl.el, datasetControl.el, deltaSwitch)

  backbone.subscribe((value) => {
    backboneControl.set(value)
    body.classList.remove('is-swapping')
    void body.offsetWidth
    body.classList.add('is-swapping')
    render(value)
  })
  render(backbone.get())
}
