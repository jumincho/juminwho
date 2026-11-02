import { segmented } from '../lib/controls'
import { h, html } from '../lib/dom'
import { icon } from '../lib/icons'
import { mathHtml } from '../lib/math'
import { onFirstView, prefersReducedMotion } from '../lib/motion'

/**
 * Figure 1: the Springfield example. Both runs share the question and the
 * plan; step through them side by side to see where the baseline loses the
 * detail that the next operation needs.
 */

type Tone = 'plain' | 'miss' | 'ours'

interface Cell {
  kicker: string
  body: string
  note?: string
  tone?: Tone
  badge?: { text: string; good: boolean }
}

const STEPS = ['Run o₁', 'Output', 'Run o₂', 'Result'] as const

const lanes: { id: 'base' | 'ours'; tag: string; title: string; cells: Cell[] }[] = [
  {
    id: 'base',
    tag: 'A',
    title: 'Baseline: local execution',
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
    tag: 'B',
    title: 'Forward-looking guidance (ours)',
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
  el.append(
    html(`<span class="mv-kicker"><span class="mv-num">${stepIndex + 1}</span><span>${data.kicker}</span></span>`),
    html(`<p class="mv-body">${data.body}</p>`),
  )
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
      <span class="mv-label">Plan, generated before execution</span>
      <ol>
        <li>${mathHtml('o_1')}<span>Where was the person born?</span></li>
        <li>${mathHtml('o_2')}<span>Which organization is located in <em>[that place]</em>?</span></li>
      </ol>
    </div>`),
  )

  const grid = h('ol', { class: 'mv-grid', 'aria-label': 'Execution of the plan, step by step, in both settings' })
  lanes.forEach((lane, laneIndex) => {
    grid.append(
      h(
        'li',
        { class: `mv-lane-title lane-${lane.id}`, style: `--dr:${laneIndex + 1};--dc:1;--mr:1;--mc:${laneIndex + 1}` },
        h('span', { class: 'mv-tag' }, lane.tag),
        h('span', {}, lane.title),
      ),
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
    for (const el of cells) {
      const k = Number(el.dataset.step)
      el.classList.toggle('is-shown', k <= step)
      el.classList.toggle('is-current', k === step)
    }
    control.set(String(step))
  }

  const stop = () => window.clearTimeout(timer)
  const play = () => {
    stop()
    show(1)
    const next = () => {
      if (at >= STEPS.length) return
      timer = window.setTimeout(() => {
        show(at + 1)
        next()
      }, 1100)
    }
    next()
  }

  const control = segmented<string>(
    'Step',
    STEPS.map((label, index) => ({ value: String(index + 1), label })),
    '4',
    (value) => {
      stop()
      show(Number(value))
    },
  )
  const replay = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Replay from the start', title: 'Replay' })
  replay.append(html(icon('rotate-ccw')))
  replay.addEventListener('click', play)
  tools?.append(control.el, replay)

  // Everything is visible until the figure is reached; then it plays once from the start.
  show(STEPS.length)
  if (!prefersReducedMotion()) onFirstView(root, play, 0.3)
}
