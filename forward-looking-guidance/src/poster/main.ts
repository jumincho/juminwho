// Static cuts, not the page's variable fonts: Chromium writes variable fonts into a PDF as Type 3
// glyph procedures, which some print preflights reject. Static ones go in as ordinary TrueType.
import '@fontsource/inter/400.css'
import '@fontsource/inter/400-italic.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/600-italic.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/700-italic.css'
import '@fontsource/inter/800.css'
import '@fontsource/source-serif-4/400.css'
import '@fontsource/source-serif-4/400-italic.css'
import '@fontsource/source-serif-4/600.css'
import '@fontsource/source-serif-4/600-italic.css'
import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/figures.css'
import './poster.css'

import QRCode from 'qrcode'
import { backbones, column, datasets, depthResults, mainResults, type Backbone, type Dataset } from '../data/paper'
import { byId, h, html } from '../lib/dom'
import { delta, int, percent, score } from '../lib/format'
import { mountHero } from '../widgets/hero'
import { mountMotivation } from '../widgets/motivation'
import { mountPipeline } from '../widgets/pipeline'

/**
 * The poster (poster.html): the project page's own figures, drawn for paper,
 * plus the main results as a table. `npm run poster` opens it with reduced
 * motion, so every figure shows one complete, still state, and waits for
 * `data-poster-ready` before printing.
 */

/** Where the QR code on the poster leads. */
const PROJECT_PAGE = 'https://jumincho.github.io/juminwho/forward-looking-guidance/'

/** Table 2 on the poster: EM only, the baselines first, then each planner over its +FG variant. */
const GROUPS: string[][] = [
  ['CoT', 'RAG w/ CoT', 'Iter-RetGen', 'GenGround'],
  ['SelfAsk', 'SelfAsk+FG'],
  ['DualRAG', 'DualRAG+FG'],
  ['STRIDE', 'STRIDE+FG'],
]

function em(backbone: Backbone, method: string, dataset: Dataset): number {
  const row = mainResults[backbone].find((r) => r.method === method)
  if (!row) throw new Error(`no result row for ${method}`)
  return row.scores[column(dataset, 'em')]
}

function resultsTable(): HTMLTableElement {
  // Best and second best of each column, among all ten systems of that backbone.
  const top = new Map<string, number[]>()
  for (const b of backbones) {
    for (const d of datasets) {
      const values = [...new Set(mainResults[b.id].map((r) => r.scores[column(d.id, 'em')]))].sort((x, y) => y - x)
      top.set(`${b.id}|${d.id}`, values.slice(0, 2))
    }
  }

  const table = h('table', { class: 'ps-table' })
  table.append(
    h(
      'thead',
      {},
      h('tr', {}, h('th', { rowspan: 2, class: 'ps-t-method' }, 'Method'), ...backbones.map((b) => h('th', { colspan: 3, class: 'ps-t-group' }, b.label))),
      h('tr', {}, ...backbones.flatMap(() => datasets.map((d) => h('th', { class: 'ps-t-data' }, d.short)))),
    ),
  )

  for (const group of GROUPS) {
    const body = h('tbody')
    for (const method of group) {
      const base = mainResults.qwen.find((r) => r.method === method)?.base
      const tr = h('tr', { class: base ? 'is-fg' : '' }, h('th', { scope: 'row', class: 'ps-t-method' }, method))
      for (const b of backbones) {
        for (const d of datasets) {
          const value = em(b.id, method, d.id)
          const [best, second] = top.get(`${b.id}|${d.id}`) ?? []
          const rank = value === best ? 'is-best' : value === second ? 'is-second' : ''
          const td = h('td', { class: rank }, h('span', { class: 'ps-t-value' }, score(value)))
          if (base) {
            const change = value - em(b.id, base, d.id)
            const tone = Math.round(change * 1000) > 0 ? 'is-up' : Math.round(change * 1000) < 0 ? 'is-down' : 'is-flat'
            td.append(h('span', { class: `ps-t-delta ${tone}` }, delta(change)))
          }
          tr.append(td)
        }
      }
      body.append(tr)
    }
    table.append(body)
  }
  return table
}

/**
 * Table 3 on the poster: one bar per depth, STRIDE's EM with the gain from FG stacked on it, and the
 * relative gain beside it, so the near-constant 30% reads down one column.
 */
function depthBars(): HTMLElement {
  const max = 0.45
  const at = (value: number) => `${((value / max) * 100).toFixed(2)}%`
  const list = h('ul', { class: 'ps-dp' })
  for (const d of depthResults) {
    list.append(
      h(
        'li',
        { class: `ps-dp-row${d.group === 'Overall' ? ' is-overall' : ''}` },
        h('span', { class: 'ps-dp-label' }, h('b', {}, d.group), h('small', {}, `n = ${int(d.questions)}`)),
        h(
          'span',
          { class: 'ps-dp-track' },
          h('span', { class: 'ps-dp-base', style: `width:${at(d.stride)}` }),
          h('span', { class: 'ps-dp-gain', style: `left:${at(d.stride)};width:${at(d.fg - d.stride)}` }),
        ),
        h('span', { class: 'ps-dp-values' }, `${score(d.stride)} `, h('span', { class: 'ps-arrow' }, '→'), ' ', h('b', {}, score(d.fg))),
        h('span', { class: 'ps-dp-rel' }, percent(d.relative)),
      ),
    )
  }
  return list
}

function mount(id: string, run: (el: HTMLElement) => void): void {
  const el = byId(id)
  if (el) run(el)
}

mount('hero-visual', (el) => mountHero(el))
mount('fig-motivation', (el) => mountMotivation(el, null))
mount('fig-pipeline', (el) => mountPipeline(el))
mount('tbl-results', (el) => el.replaceChildren(resultsTable()))
mount('fig-depth', (el) => el.replaceChildren(depthBars()))

async function finish(): Promise<void> {
  // A vector QR code with no margin of its own: the poster's layout keeps the quiet zone around it.
  const svg = await QRCode.toString(PROJECT_PAGE, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#0b0f17', light: '#ffffff' } })
  byId('qr')?.replaceChildren(html(svg))
  await document.fonts.ready
  // Two frames, so the charts that redraw on resize have settled.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  document.documentElement.dataset.posterReady = 'true'
}

void finish()
