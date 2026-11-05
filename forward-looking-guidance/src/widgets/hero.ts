import { responsive } from '../lib/chart'
import { h, html, s } from '../lib/dom'
import { icon } from '../lib/icons'
import { mathTspans } from '../lib/math'
import { prefersReducedMotion, watchVisibility } from '../lib/motion'
import { tween } from '../lib/tween'

/**
 * The hero figure: a plan of operations runs one step at a time, and the
 * operations still ahead (G_i) are shown to the step that is running. It
 * loops on its own, pauses off screen, and holds still with reduced motion.
 */

const STEP_MS = 2400
const HOLD_MS = 3400

interface Layout {
  width: number
  height: number
  narrow: boolean
  n: number
  r: number
  pad: number
  xs: number[]
  y: number
  fs: number
  card: { w: number; h: number; gap: number }
}

function layoutFor(width: number, height: number): Layout {
  const narrow = width < 560
  const n = narrow ? 4 : 5
  const r = narrow ? 17 : Math.round(Math.min(27, Math.max(21, width * 0.021)))
  // Wide figures keep at least 110 px between operations, so the running step's card (156 px wide)
  // clears the output chip (36 px) of the step before it.
  const margin = narrow ? 40 : Math.max(Math.min(100, (width - 4 * 110) / 2), width * 0.11)
  const xs = Array.from({ length: n }, (_, k) => Math.round(margin + (k * (width - 2 * margin)) / (n - 1)))
  return {
    width,
    height,
    narrow,
    n,
    r,
    pad: narrow ? 9 : 13,
    xs,
    y: Math.round(height * (narrow ? 0.5 : 0.48)),
    fs: narrow ? 15 : 18,
    card: narrow ? { w: 112, h: 46, gap: 14 } : { w: 156, h: 54, gap: 16 },
  }
}

interface Parts {
  svg: SVGSVGElement
  trackDone: SVGLineElement
  region: SVGRectElement
  regionLabel: SVGGElement
  regionMath: SVGTextElement
  arrow: SVGPathElement
  pulse: SVGGElement
  nodes: SVGGElement[]
  chips: SVGGElement[]
  card: SVGGElement
  cardLines: SVGTextElement[]
}

function setMath(text: SVGTextElement, source: string, fontSize: number): void {
  text.replaceChildren(...mathTspans(source, fontSize))
}

function build(L: Layout): Parts {
  const { width, height, n, r, pad, xs, y, fs, card } = L
  const svg = s('svg', {
    class: 'hero-svg',
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label':
      'Animation: a plan of operations is executed one at a time. While each operation runs, the operations that remain are shown to its extractor and reasoner as forward-looking guidance.',
  })
  svg.append(
    s(
      'defs',
      {},
      s(
        'marker',
        { id: 'hero-tip', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' },
        s('path', { d: 'M1 1.5 8.5 5 1 8.5', class: 'hero-arrowhead' }),
      ),
    ),
  )

  svg.append(s('line', { class: 'hero-track', x1: xs[0], x2: xs[n - 1], y1: y, y2: y }))
  const trackDone = s('line', { class: 'hero-track-done', x1: xs[0], x2: xs[0], y1: y, y2: y })
  const region = s('rect', { class: 'hero-region', x: xs[1] - r - pad, y: y - r - pad, width: 0, height: 2 * (r + pad), rx: r + pad })
  const regionMath = s('text', { class: 'hero-region-math', 'text-anchor': 'middle', y: 0 })
  const regionLabel = s(
    'g',
    { class: 'hero-region-label' },
    s('text', { class: 'hero-kicker', 'text-anchor': 'middle', y: -fs - 6 }, 'Remaining plan'),
    regionMath,
  )
  const arrow = s('path', { class: 'hero-arrow', 'marker-end': 'url(#hero-tip)' })
  svg.append(trackDone, region, regionLabel, arrow)

  const pulse = s('g', { class: 'hero-pulse-at' }, s('circle', { class: 'hero-pulse', r }))
  svg.append(pulse)

  const nodes = xs.map((x, k) => {
    const label = s('text', { class: 'hero-node-label', 'text-anchor': 'middle', y: Math.round(fs * 0.34) })
    setMath(label, `o_${k + 1}`, fs)
    const node = s('g', { class: 'hero-node', transform: `translate(${x} ${y})` }, s('circle', { r }), label)
    svg.append(node)
    return node
  })

  const chips = xs.map((x, k) => {
    const last = k === n - 1
    const text = s('text', { class: 'hero-chip-text', 'text-anchor': 'middle', y: 4 })
    if (last) text.textContent = 'answer'
    else setMath(text, `r_${k + 1}`, 13)
    const w = last ? 62 : 36
    const chip = s(
      'g',
      { class: `hero-chip${last ? ' is-answer' : ''}`, transform: `translate(${x} ${y + r + 22})` },
      s('rect', { x: -w / 2, y: -11, width: w, height: 22, rx: 11 }),
      text,
    )
    svg.append(chip)
    return chip
  })

  const cardLines = [0, 1].map((line) =>
    s('text', { class: 'hero-card-text', x: -card.w / 2 + 14, y: card.gap + (line === 0 ? card.h * 0.42 : card.h * 0.78) }),
  )
  const cardEl = s(
    'g',
    { class: 'hero-card' },
    s('rect', { x: -card.w / 2, y: card.gap, width: card.w, height: card.h, rx: 12 }),
    ...cardLines,
  )
  svg.append(cardEl)

  if (!L.narrow) {
    const legend = s('g', { class: 'hero-legend', transform: `translate(20 ${height - 22})` })
    const items: [string, string][] = [
      ['is-done', 'resolved'],
      ['is-active', 'running'],
      ['is-next', 'remaining, shown as guidance'],
    ]
    let x = 0
    for (const [state, label] of items) {
      legend.append(
        s('circle', { class: `hero-legend-dot ${state}`, cx: x + 5, cy: -4, r: 5 }),
        s('text', { x: x + 16, y: 0 }, label),
      )
      x += 26 + label.length * 6.6
    }
    svg.append(legend)
  }

  return { svg, trackDone, region, regionLabel, regionMath, arrow, pulse, nodes, chips, card: cardEl, cardLines }
}

/**
 * Shows step `step` of the loop: 1…n runs o_step, and n + 1 is the finished plan.
 * Positions slide with CSS transitions and tweens unless `animate` is false.
 */
function apply(L: Layout, P: Parts, step: number, animate: boolean): void {
  const { n, r, pad, xs, y, fs, card } = L
  const done = step > n
  const i = Math.min(step, n) // 1-based operation being resolved
  const guided = !done && i < n
  const duration = animate ? 620 : 0

  P.svg.classList.toggle('is-instant', !animate)
  P.nodes.forEach((node, k) => {
    const index = k + 1
    node.classList.toggle('is-done', done || index < i)
    node.classList.toggle('is-active', !done && index === i)
    node.classList.toggle('is-next', !done && index > i)
  })
  P.chips.forEach((chip, k) => chip.classList.toggle('is-on', done || (k + 1 < i && k < n - 1)))

  tween(P.trackDone, { x2: xs[done ? n - 1 : i - 1] }, duration)

  const x = xs[i - 1]
  // The card sits under the running operation, nudged inward at the edges of a narrow figure.
  const cardX = Math.min(Math.max(x, card.w / 2 + 8), L.width - card.w / 2 - 8)
  P.pulse.style.transform = `translate(${x}px, ${y}px)`
  P.pulse.classList.toggle('is-off', done)
  P.card.style.transform = `translate(${cardX}px, ${y + r}px)`
  P.card.classList.toggle('is-off', done)

  const [extract, reason] = P.cardLines
  const suffix = guided ? ` + G_${i}` : ''
  for (const [line, word] of [
    [extract, 'extractor'],
    [reason, 'reasoner'],
  ] as const) {
    line.replaceChildren(s('tspan', { class: 'hero-word' }, word), ...mathTspans(suffix, 14, 'svg-math hero-g'))
  }

  P.region.classList.toggle('is-off', !guided)
  P.regionLabel.classList.toggle('is-off', !guided)
  P.arrow.classList.remove('is-on')
  if (!guided) return

  const x1 = xs[i] - r - pad
  const x2 = xs[n - 1] + r + pad
  tween(P.region, { x: x1, width: x2 - x1 }, duration)

  const remaining = Array.from({ length: n - i }, (_, k) => `o_{${i + k + 1}}`).join(', ')
  setMath(P.regionMath, `G_${i} = (${remaining})`, fs)
  // Keep the label inside the figure when the remaining plan is short and sits at the edge.
  const half = (P.regionMath.getComputedTextLength?.() || remaining.length * fs * 0.45) / 2 + 10
  const cx = Math.min(Math.max((x1 + x2) / 2, half), L.width - half)
  P.regionLabel.style.transform = `translate(${cx}px, ${y - r - pad - 14}px)`

  // Guidance flows from the remaining plan into the running step's extractor and reasoner: down from
  // the plan's lower edge and into the card's side. The card's top sits level with that edge, so the
  // arrow always enters from the side, starting far enough right of the card to curve in. A figure too
  // tight for that shows no arrow rather than a stub.
  const side = cardX + card.w / 2 + 7
  const sx = Math.min(Math.max(x1 + 18, side + 28), x2 - 18)
  const sy = y + r + pad
  if (sx - side < 24) return
  const ey = y + r + card.gap + card.h / 2
  P.arrow.setAttribute('d', `M${sx} ${sy} C${sx} ${ey}, ${sx} ${ey}, ${side} ${ey}`)
  window.setTimeout(() => P.arrow.classList.add('is-on'), animate ? 420 : 0)
}

export function mountHero(container: HTMLElement): void {
  const reduced = prefersReducedMotion()
  let L: Layout | null = null
  let P: Parts | null = null
  // With reduced motion the figure holds one representative moment: o2 running, o3… ahead.
  let step = reduced ? 2 : 1
  let timer = 0
  let visible = false
  let paused = reduced

  const button = h('button', { type: 'button', class: 'icon-btn hero-pause', 'aria-label': 'Pause animation', title: 'Pause animation' })
  const setButton = () => {
    button.replaceChildren(html(icon(paused ? 'play' : 'pause')))
    const label = paused ? 'Play animation' : 'Pause animation'
    button.setAttribute('aria-label', label)
    button.title = label
  }

  const draw = (width: number) => {
    L = layoutFor(width, container.clientHeight || Math.round(width * 0.3))
    P = build(L)
    container.querySelector('svg')?.remove()
    container.prepend(P.svg)
    apply(L, P, step, false)
  }

  const schedule = () => {
    window.clearTimeout(timer)
    if (paused || !visible || document.hidden || !L) return
    const finished = step > L.n
    timer = window.setTimeout(advance, finished ? HOLD_MS : STEP_MS)
  }

  const advance = () => {
    if (!L || !P) return
    if (step > L.n) {
      // Fade out the finished plan, then start again from the first operation.
      const svg = P.svg
      svg.classList.add('is-fading')
      window.setTimeout(() => {
        step = 1
        if (L && P) apply(L, P, step, false)
        svg.classList.remove('is-fading')
        schedule()
      }, 380)
      return
    }
    step += 1
    apply(L, P, step, true)
    schedule()
  }

  responsive(container, draw)
  document.fonts?.ready.then(() => L && P && apply(L, P, step, false))

  if (reduced) return
  setButton()
  container.append(button)
  button.addEventListener('click', () => {
    paused = !paused
    // Pausing stops everything that moves, the pulse and the flowing arrow included.
    container.classList.toggle('is-paused', paused)
    setButton()
    schedule()
  })
  watchVisibility(container, (isVisible) => {
    visible = isVisible
    schedule()
  })
  document.addEventListener('visibilitychange', schedule)
}
