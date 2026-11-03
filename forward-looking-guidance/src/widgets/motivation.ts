import { h, html } from '../lib/dom'
import { icon } from '../lib/icons'
import { mathHtml } from '../lib/math'
import { onFirstView, prefersReducedMotion } from '../lib/motion'

/**
 * Figure 1: the Springfield example. Both runs share the question and the
 * plan; they play out side by side, step by step, the first time the figure
 * is seen, and show where the baseline loses the detail the next operation needs.
 */

type Tone = 'plain' | 'miss' | 'ours'

interface Cell {
  kicker: string
  body: string
  note?: string
  tone?: Tone
  badge?: { text: string; good: boolean }
}

const STEPS = 4

const lanes: { id: 'base' | 'ours'; title: string; cells: Cell[] }[] = [
  {
    id: 'base',
    title: 'Baseline',
    cells: [
      { kicker: `Run ${mathHtml('o_1')}`, body: 'Where was the person born?', note: `Sees only ${mathHtml('o_1')}.` },
      { kicker: `Output of ${mathHtml('o_1')}`, body: '<q>Springfield</q>', note: 'Locally adequate', tone: 'miss' },
      {
        kicker: `Run ${mathHtml('o_2')}`,
        body: 'Which organization is located in <q>Springfield</q>?',
        note: 'Which Springfield? No unambiguous target.',
      },
      { kicker: 'Result', body: 'Missing detail', tone: 'miss', badge: { text: 'Fails', good: false } },
    ],
  },
  {
    id: 'ours',
    title: 'With forward-looking guidance',
    cells: [
      {
        kicker: `Run ${mathHtml('o_1')} with ${mathHtml('o_2')} in view`,
        body: 'Where was the person born?',
        note: `Also reads ${mathHtml('G_1 = (o_2)', 'm g')}.`,
        tone: 'ours',
      },
      { kicker: `Output of ${mathHtml('o_1')}`, body: '<q>Springfield, Illinois</q>', note: 'Preserves the needed detail', tone: 'ours' },
      {
        kicker: `Run ${mathHtml('o_2')}`,
        body: 'Which organization is located in <q>Springfield, Illinois</q>?',
        note: 'One unambiguous target.',
      },
      { kicker: 'Result', body: 'Resolved', tone: 'ours', badge: { text: 'Succeeds', good: true } },
    ],
  },
]

function cell(laneIndex: number, stepIndex: number, data: Cell): HTMLElement {
  const el = h('li', {
    class: `mv-cell tone-${data.tone ?? 'plain'}`,
    'data-step': stepIndex + 1,
    // Grid positions for both layouts: lanes as rows on wide screens, as columns on narrow ones.
    style: `--dr:${laneIndex + 1};--dc:${stepIndex + 2};--mr:${stepIndex + 2};--mc:${laneIndex + 1}`,
  })
  el.append(html(`<span class="mv-kicker">${data.kicker}</span>`), html(`<p class="mv-body">${data.body}</p>`))
  if (data.note) el.append(html(`<p class="mv-note">${data.note}</p>`))
  if (data.badge) {
    el.append(
      html(
        `<span class="mv-badge ${data.badge.good ? 'is-good' : 'is-bad'}">${icon(data.badge.good ? 'circle-check' : 'circle-x')}${data.badge.text}</span>`,
      ),
    )
  }
  return el
}

export function mountMotivation(container: HTMLElement, tools: HTMLElement | null): void {
  const context = h('div', { class: 'mv-context' })
  context.append(
    html(`<div class="mv-question">
      <span class="mv-label">Question ${mathHtml('q')}</span>
      <p>Which organization is located in the birthplace of [Person X]?</p>
    </div>`),
    html(`<div class="mv-plan">
      <span class="mv-label">Plan, written before execution</span>
      <ol>
        <li>${mathHtml('o_1')}<span>Where was the person born?</span></li>
        <li>${mathHtml('o_2')}<span>Which organization is located in <em>[that place]</em>?</span></li>
      </ol>
    </div>`),
  )

  const grid = h('ol', { class: 'mv-grid', 'aria-label': 'Execution of the plan, step by step, in both settings' })
  lanes.forEach((lane, laneIndex) => {
    grid.append(
      h('li', { class: `mv-lane-title lane-${lane.id}`, style: `--dr:${laneIndex + 1};--dc:1;--mr:1;--mc:${laneIndex + 1}` }, lane.title),
    )
    lane.cells.forEach((data, stepIndex) => {
      const el = cell(laneIndex, stepIndex, data)
      el.classList.add(`lane-${lane.id}`)
      grid.append(el)
    })
  })

  const root = h('div', { class: 'mv' }, context, grid)
  container.append(root)

  const cells = [...grid.querySelectorAll<HTMLElement>('.mv-cell')]
  let at = 0
  let timer = 0

  const show = (step: number) => {
    at = step
    for (const el of cells) el.classList.toggle('is-shown', Number(el.dataset.step) <= step)
  }

  const play = () => {
    window.clearTimeout(timer)
    show(1)
    const next = () => {
      if (at >= STEPS) return
      timer = window.setTimeout(() => {
        show(at + 1)
        next()
      }, 1100)
    }
    next()
  }

  const replay = h('button', { type: 'button', class: 'btn btn-sm btn-line' })
  replay.append(html(icon('rotate-ccw')), document.createTextNode('Replay'))
  replay.addEventListener('click', play)
  tools?.append(replay)

  // Everything is visible until the figure is reached; then it plays once from the start.
  show(STEPS)
  if (!prefersReducedMotion()) onFirstView(root, play, 0.3)
}
