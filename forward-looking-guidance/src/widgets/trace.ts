import { trace } from '../data/paper'
import { h, html } from '../lib/dom'
import { icon } from '../lib/icons'
import { mathHtml } from '../lib/math'
import { prefersReducedMotion, watchVisibility } from '../lib/motion'

/**
 * Figure 6: Table 4 as a step-through. Both runs start from the same context;
 * each step reveals one row for both systems, with a note on what changed.
 * Rows ahead wait as compact placeholders, so the shape of the trace is
 * visible from the start.
 */

const MEMBERS = 'Thijs van Leer, Jan Akkerman, Martin Dresden'

/** What each step shows, in the words of the paper's case study. */
const NOTES = [
  `Before resolving ${mathHtml('o_1')}, STRIDE+FG also reads the operations that remain, ${mathHtml('o_2')} and ${mathHtml('o_3')}. STRIDE sees only ${mathHtml('o_1')}.`,
  'Same evidence, different facts. With later operations in view, STRIDE+FG keeps the individual line-up; STRIDE keeps only the band.',
  `STRIDE answers ${mathHtml('o_1')} with the band Focus: locally valid, but not the person-valued output that ${mathHtml('o_2')} requires.`,
  `The names carry into the query for ${mathHtml('o_2')}. STRIDE asks for the birth date of a band.`,
  'Both retrievals return a page on Jan Akkerman.',
  'Both runs extract the same birth-date fact.',
  `STRIDE cannot accept a person’s birth date as an answer to its band-scoped query, so ${mathHtml('o_2')} fails. STRIDE+FG commits the fact.`,
  `STRIDE never reaches ${mathHtml('o_3')}. STRIDE+FG passes the fact on, and ${mathHtml('o_3')} selects Jan Akkerman. Guidance changed which value from the same evidence survived into the next operation.`,
]

/** Phrases to mark in each step: what one run keeps and the other loses, or (shared) what both have. */
const MARKS: { stride?: string[]; fg?: string[]; shared?: boolean }[] = [
  {},
  { stride: ['the Dutch rock band Focus'], fg: [MEMBERS + ', and Hans Cleuver'] },
  { stride: ['Focus (the band)'], fg: [MEMBERS + ', Hans Cleuver'] },
  { stride: ['Focus'], fg: [MEMBERS + ', Hans Cleuver'] },
  { stride: ['Jan Akkerman'], fg: ['Jan Akkerman'], shared: true },
  {},
  {},
  {},
]

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** Operation names (o_2) become math; marked phrases are wrapped once each. */
function rich(text: string, marks: string[] = [], tone = ''): string {
  let out = escape(text).replace(/\bo_(\d)/g, (_, k: string) => mathHtml(`o_${k}`))
  for (const phrase of marks) {
    const at = out.lastIndexOf(escape(phrase))
    if (at >= 0) out = `${out.slice(0, at)}<mark class="${tone}">${escape(phrase)}</mark>${out.slice(at + escape(phrase).length)}`
  }
  return out
}

function outcome(text: string, good: boolean): string {
  const [how, verdict] = text.split('; ')
  return `<span>${rich(how)}</span><span class="tr-verdict ${good ? 'is-good' : 'is-bad'}">${icon(good ? 'circle-check' : 'circle-x')}${escape(verdict)}</span>`
}

export function mountTrace(container: HTMLElement, tools: HTMLElement | null): void {
  const total = trace.steps.length

  const context = html(`<div class="tr-context">
    <div class="tr-q">
      <span class="tr-k">Question <span class="chip">${trace.dataset}</span></span>
      <p>${escape(trace.question)}</p>
      <p class="tr-gold">Gold answer <strong>${escape(trace.answer)}</strong></p>
    </div>
    <div class="tr-shared">
      <span class="tr-k">Shared by both runs</span>
      <ol class="tr-plan">${trace.plan.map((op, k) => `<li>${mathHtml(`o_${k + 1}`)}<span>${escape(op)}</span></li>`).join('')}</ol>
      <dl class="tr-d1">
        <div><dt>Query for ${mathHtml('o_1')}</dt><dd>${escape(trace.query1)}</dd></div>
        <div><dt>Evidence ${mathHtml('D_1')}</dt><dd>${rich(trace.evidence1, ['Thijs van Leer, Jan Akkerman, Martin Dresden and Hans Cleuver'], 'is-key')}</dd></div>
      </dl>
    </div>
  </div>`)

  const rows = h('ol', { class: 'tr-rows' })
  const note = h('li', { class: 'tr-note', 'aria-live': 'polite' })
  const items = trace.steps.map((step, k) => {
    const last = k === total - 1
    const marks = MARKS[k] ?? {}
    const strideCell =
      step.stride === null
        ? '<span class="tr-none">not provided</span>'
        : last
          ? outcome(step.stride, false)
          : rich(step.stride, marks.stride, marks.shared ? 'is-key' : 'is-lost')
    const fgCell = Array.isArray(step.fg)
      ? `<ul class="tr-g">${step.fg.map((line) => `<li>${rich(line)}</li>`).join('')}</ul>`
      : last
        ? outcome(step.fg, true)
        : rich(step.fg, marks.fg, marks.shared ? 'is-key' : 'is-kept')
    const tone = k === 6 ? ' is-split' : last ? ' is-final' : ''
    const li = html(`<li class="tr-row${tone}" data-step="${k + 1}">
      <span class="tr-stage"><span class="tr-num">${k + 1}</span>${mathHtml(step.stage, 'tr-stage-text')}</span>
      <div class="tr-cell is-stride"><span class="tr-who">STRIDE</span><div>${strideCell}</div></div>
      <div class="tr-cell is-fg"><span class="tr-who">STRIDE+FG</span><div>${fgCell}</div></div>
    </li>`).firstElementChild as HTMLElement
    if (last) rows.append(html('<li class="tr-gap" aria-hidden="true">⋮</li>'))
    rows.append(li)
    return li
  })

  const head = html(`<div class="tr-head" aria-hidden="true"><span></span><span>STRIDE</span><span>STRIDE+FG <em>(ours)</em></span></div>`)
  const progress = h('div', { class: 'tr-progress', role: 'group', 'aria-label': 'Steps' })
  const dots = trace.steps.map((step, k) => {
    const dot = h('button', { type: 'button', class: 'tr-dot', 'aria-label': `Step ${k + 1}: ${step.stage.replace(/_(\d)/, '$1')}` })
    dot.addEventListener('click', () => {
      stop()
      go(k + 1)
    })
    progress.append(dot)
    return dot
  })

  const root = h('div', { class: 'tr' })
  root.append(context, progress, head, rows)
  container.append(root)

  const prev = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Previous step', title: 'Previous step (←)' })
  prev.append(html(icon('chevron-left')))
  const counter = h('span', { class: 'tr-counter', 'aria-hidden': 'true' })
  const next = h('button', { type: 'button', class: 'btn btn-sm btn-primary tr-next' })
  const play = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Play all steps', title: 'Play' })
  const reset = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Back to the first step', title: 'Restart' })
  reset.append(html(icon('rotate-ccw')))
  tools?.append(h('div', { class: 'tr-controls' }, reset, play, prev, counter, next))

  let at = 1
  let timer = 0
  let playing = false
  let visible = false

  const go = (step: number) => {
    at = Math.min(total, Math.max(1, step))
    items.forEach((item, k) => {
      item.classList.toggle('is-past', k + 1 < at)
      item.classList.toggle('is-current', k + 1 === at)
      item.classList.toggle('is-future', k + 1 > at)
      item.setAttribute('aria-current', String(k + 1 === at))
    })
    dots.forEach((dot, k) => {
      dot.classList.toggle('is-done', k + 1 <= at)
      dot.setAttribute('aria-current', String(k + 1 === at))
    })
    note.innerHTML = `<p><span class="tr-note-k">Step ${at} of ${total}</span> ${NOTES[at - 1]}</p>`
    items[at - 1].after(note)
    counter.textContent = `${at} / ${total}`
    prev.disabled = at === 1
    next.disabled = at === total
    next.replaceChildren(document.createTextNode(at === total ? 'Done' : 'Next step'), html(icon('chevron-right')))
  }

  const setPlaying = (on: boolean) => {
    playing = on
    play.replaceChildren(html(icon(on ? 'pause' : 'play')))
    play.setAttribute('aria-label', on ? 'Pause' : 'Play all steps')
    play.title = on ? 'Pause' : 'Play'
  }
  const stop = () => {
    window.clearTimeout(timer)
    setPlaying(false)
  }
  const tick = () => {
    window.clearTimeout(timer)
    if (!playing || !visible || document.hidden) return
    timer = window.setTimeout(() => {
      if (at >= total) {
        stop()
        return
      }
      go(at + 1)
      tick()
    }, 2600)
  }

  prev.addEventListener('click', () => {
    stop()
    go(at - 1)
  })
  next.addEventListener('click', () => {
    stop()
    go(at + 1)
  })
  reset.addEventListener('click', () => {
    stop()
    go(1)
  })
  play.addEventListener('click', () => {
    if (playing) {
      stop()
      return
    }
    if (at >= total) go(1)
    setPlaying(true)
    tick()
  })

  // Arrow keys step through while focus is anywhere in the figure.
  const frame = container.closest('.figure-frame') ?? root
  frame.addEventListener('keydown', (event) => {
    const key = (event as KeyboardEvent).key
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return
    if ((event.target as HTMLElement).closest('.segmented')) return
    event.preventDefault()
    stop()
    go(at + (key === 'ArrowRight' ? 1 : -1))
  })

  watchVisibility(root, (isVisible) => {
    visible = isVisible
    tick()
  })
  document.addEventListener('visibilitychange', tick)

  setPlaying(false)
  if (prefersReducedMotion()) root.classList.add('is-still')
  go(1)
}
