import { stageEffects, type Stage } from '../data/paper'
import { h, html, s } from '../lib/dom'
import { delta } from '../lib/format'
import { mathHtml, mathTspans } from '../lib/math'

/**
 * Figure 2: the planning-based pipeline, redrawn, over the measured change in
 * EM for each stage that can receive G_i (Table 1). Picking a row of the
 * chart lights up that choice in the diagram. Wide screens get the full
 * diagram; narrow ones a vertical version of the same pipeline.
 */

type Module = 'retriever' | 'extractor' | 'reasoner' | 'answer'

const GUIDED: Record<Stage, Module[]> = {
  none: [],
  retrieval: ['retriever'],
  extraction: ['extractor'],
  reasoning: ['reasoner', 'answer'],
  'extraction+reasoning': ['extractor', 'reasoner', 'answer'],
}

/* ---------------------------------------------------------------- diagram (wide) */

const W = 1000
const H = 412
const Y_TOP = 86
const Y_MID = 204
const Y_BOT = 322
const Y_LOOP = 392

type Kind = 'doc' | 'proc' | 'module'

/** A box (process) or a document shape (data), with a title and optional subtitle lines. */
function node(x: number, cy: number, w: number, hgt: number, kind: Kind, title: string, sub: string[] = []): SVGGElement {
  const y = cy - hgt / 2
  const g = s('g', { class: `pl-node is-${kind}` })
  if (kind === 'doc') {
    const r = 7
    const b = y + hgt - 6
    g.append(
      s('path', {
        class: 'pl-shape',
        d: `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${b}Q${x + w * 0.75} ${b - 8} ${x + w / 2} ${b}T${x} ${b}V${y + r}Q${x} ${y} ${x + r} ${y}Z`,
      }),
    )
  } else {
    g.append(s('rect', { class: 'pl-shape', x, y, width: w, height: hgt, rx: kind === 'module' ? 11 : 12 }))
  }
  const lines = sub.length
  const titleY = cy + 5 - lines * 8 - (kind === 'doc' ? 2 : 0)
  g.append(label(x + w / 2, titleY, title, 'pl-title', 14))
  sub.forEach((line, index) => g.append(label(x + w / 2, titleY + 17 + index * 15, line, 'pl-sub', 12)))
  return g
}

function arrow(d: string, className = 'pl-edge'): SVGPathElement {
  return s('path', { class: className, d, 'marker-end': 'url(#pl-head)' })
}

/** SVG text in `size` px; the size is an attribute, not CSS, because subscripts are sized from it. */
function label(x: number, y: number, source: string, className: string, size: number, anchor = 'middle'): SVGTextElement {
  const t = s('text', { class: className, x, y, 'font-size': size, 'text-anchor': anchor })
  t.append(...mathTspans(source, size, 'pl-t'))
  return t
}

interface Insertion {
  module: Module
  box: SVGGElement
  link: SVGPathElement
  pill: SVGGElement
}

function pill(cx: number, cy: number): SVGGElement {
  // Diagram pills read "+ G_i", as in the paper's figure; the equations keep ⊕.
  const t = label(cx, cy + 4.5, '+ G_i', 'pl-pill-text', 13)
  return s('g', { class: 'pl-pill' }, s('rect', { x: cx - 27, y: cy - 11, width: 54, height: 22, rx: 11 }), t)
}

function buildDiagram(): { svg: SVGSVGElement; insertions: Insertion[] } {
  const svg = s('svg', {
    class: 'pl-svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label':
      'Pipeline: the question goes to a planner, which writes operations o1 to on. A controller selects an operation and an action. Retrieve or rewrite runs a retriever, an extractor and a reasoner; answer runs a reasoner over the accumulated facts. The execution state is updated and the next operation follows. The remaining operations, G i, can be appended to the retriever, the extractor or the reasoner.',
  })
  svg.append(
    s(
      'defs',
      {},
      ...[
        ['pl-head', 'pl-head'],
        ['pl-head-g', 'pl-head is-g'],
        ['pl-head-miss', 'pl-head is-miss'],
      ].map(([id, cls]) =>
        s(
          'marker',
          { id, viewBox: '0 0 10 10', refX: 8.5, refY: 5, markerWidth: 6.5, markerHeight: 6.5, orient: 'auto-start-reverse' },
          s('path', { d: 'M1 1.5 9 5 1 8.5Z', class: cls }),
        ),
      ),
    ),
  )

  // Left: question, planner, operations, controller.
  svg.append(
    node(2, Y_MID, 74, 54, 'doc', 'Question', ['q']),
    arrow(`M76 ${Y_MID}H92`),
    node(94, Y_MID, 110, 66, 'proc', 'Planner', ['writes the plan']),
    arrow(`M204 ${Y_MID}H222`),
    node(224, Y_MID, 112, 56, 'doc', 'Operations', ['o_1, …, o_n']),
    arrow(`M336 ${Y_MID}H356`),
    node(358, Y_MID, 128, 74, 'proc', 'Controller', ['selects o_i and', 'its action']),
  )

  // The fork into the two actions.
  svg.append(
    s('path', { class: 'pl-edge', d: `M486 ${Y_MID}H508` }),
    s('path', { class: 'pl-edge', d: `M508 ${Y_TOP}V${Y_BOT}` }),
    arrow(`M508 ${Y_TOP}H528`),
    arrow(`M508 ${Y_BOT}H528`),
    label(530, Y_TOP - 42, 'If the action is retrieve or rewrite', 'pl-kicker', 12, 'start'),
    label(530, Y_BOT - 42, 'If the action is answer', 'pl-kicker', 12, 'start'),
  )

  // Retrieve / rewrite: retriever → extractor → reasoner.
  const retriever = node(530, Y_TOP, 102, 52, 'module', 'Retriever')
  const extractor = node(680, Y_TOP, 102, 52, 'module', 'Extractor')
  const reasoner = node(830, Y_TOP, 102, 52, 'module', 'Reasoner')
  svg.append(
    retriever,
    arrow(`M632 ${Y_TOP}H678`),
    label(656, Y_TOP - 8, 'D_i', 'pl-art', 14),
    label(656, Y_TOP + 18, 'docs', 'pl-art-sub', 11),
    extractor,
    arrow(`M782 ${Y_TOP}H828`),
    label(806, Y_TOP - 8, 'f_i', 'pl-art', 14),
    label(806, Y_TOP + 18, 'facts', 'pl-art-sub', 11),
    reasoner,
    s('path', { class: 'pl-edge', d: `M932 ${Y_TOP}H976` }),
    label(954, Y_TOP - 8, 'r_i', 'pl-art', 14),
    label(954, Y_TOP + 18, 'output', 'pl-art-sub', 11),
  )

  // Answer: the reasoner works from the facts already in S.
  const answer = node(830, Y_BOT, 102, 52, 'module', 'Reasoner')
  svg.append(
    node(530, Y_BOT, 136, 54, 'doc', 'Accumulated facts', ['in the state S']),
    arrow(`M666 ${Y_BOT}H828`),
    answer,
    s('path', { class: 'pl-edge', d: `M932 ${Y_BOT}H976` }),
    label(954, Y_BOT - 8, 'r_i', 'pl-art', 14),
    label(954, Y_BOT + 18, 'output', 'pl-art-sub', 11),
  )

  // The loop back to the operations.
  svg.append(
    s('path', { class: 'pl-edge pl-loop', d: `M976 ${Y_TOP}V${Y_LOOP}H280V${Y_MID + 34}`, 'marker-end': 'url(#pl-head)' }),
    label(620, Y_LOOP - 9, 'update the execution state S and proceed to o_{i+1}', 'pl-loop-text', 13),
  )

  // The remaining plan and where it can enter.
  const gx = 626
  const gw = 210
  const gTop = Y_MID - 32
  const gBottom = Y_MID + 32
  const remaining = s(
    'g',
    { class: 'pl-g' },
    s('rect', { x: gx, y: gTop, width: gw, height: 64, rx: 14 }),
    label(gx + gw / 2, Y_MID - 7, 'Remaining operations', 'pl-g-title', 13),
    label(gx + gw / 2, Y_MID + 18, 'G_i = (o_{i+1}, …, o_n)', 'pl-g-math', 17),
  )
  svg.append(remaining)

  const pillBelow = Y_TOP + 26 + 15
  const pillAbove = Y_BOT - 26 - 15
  const insertions: Insertion[] = [
    { module: 'retriever', box: retriever, link: s('path', { d: `M650 ${gTop}C650 ${gTop - 16} 581 ${pillBelow + 26} 581 ${pillBelow + 12}` }), pill: pill(581, pillBelow) },
    { module: 'extractor', box: extractor, link: s('path', { d: `M731 ${gTop}V${pillBelow + 12}` }), pill: pill(731, pillBelow) },
    { module: 'reasoner', box: reasoner, link: s('path', { d: `M812 ${gTop}C812 ${gTop - 16} 881 ${pillBelow + 26} 881 ${pillBelow + 12}` }), pill: pill(881, pillBelow) },
    { module: 'answer', box: answer, link: s('path', { d: `M812 ${gBottom}C812 ${gBottom + 16} 881 ${pillAbove - 26} 881 ${pillAbove - 12}` }), pill: pill(881, pillAbove) },
  ]
  for (const insertion of insertions) {
    insertion.link.setAttribute('class', 'pl-link')
    insertion.link.setAttribute('marker-end', 'url(#pl-head)')
    svg.insertBefore(insertion.link, remaining)
    svg.append(insertion.pill)
  }
  return { svg, insertions }
}

/* ---------------------------------------------------------------- flow (narrow) */

function buildFlow(): { el: HTMLElement; items: Map<Module, HTMLElement> } {
  const items = new Map<Module, HTMLElement>()
  const moduleItem = (module: Module, name: string) => {
    const li = h('li', { class: 'pf-module' })
    li.append(h('span', {}, name), html(`<span class="pf-pill">${mathHtml('+ G_i')}</span>`))
    items.set(module, li)
    return li
  }
  const artifact = (math: string, word: string) => html(`<li class="pf-art">${mathHtml(math)} ${word}</li>`)

  const el = h('div', { class: 'pf' })
  el.append(
    html(`<ol class="pf-chain">
      <li class="is-doc">Question ${mathHtml('q')}</li>
      <li>Planner</li>
      <li class="is-doc">Operations ${mathHtml('o_1, …, o_n')}</li>
      <li>Controller</li>
    </ol>`),
    html(`<p class="pf-g"><span>Remaining operations</span>${mathHtml('G_i = (o_{i+1}, …, o_n)')}</p>`),
  )
  const retrieve = h('ol', { class: 'pf-steps' })
  retrieve.append(
    moduleItem('retriever', 'Retriever'),
    artifact('D_i', 'docs'),
    moduleItem('extractor', 'Extractor'),
    artifact('f_i', 'facts'),
    moduleItem('reasoner', 'Reasoner'),
    artifact('r_i', 'output'),
  )
  const answer = h('ol', { class: 'pf-steps' })
  answer.append(
    html(`<li class="pf-art">Accumulated facts in ${mathHtml('S')}</li>`),
    moduleItem('answer', 'Reasoner'),
    artifact('r_i', 'output'),
  )
  el.append(
    h(
      'div',
      { class: 'pf-branches' },
      h('div', { class: 'pf-branch' }, h('p', { class: 'pf-kicker' }, 'If retrieve or rewrite'), retrieve),
      h('div', { class: 'pf-branch' }, h('p', { class: 'pf-kicker' }, 'If answer'), answer),
    ),
    html(`<p class="pf-loop">Update the execution state ${mathHtml('S')} and proceed to ${mathHtml('o_{i+1}')}</p>`),
  )
  return { el, items }
}

/* ---------------------------------------------------------------- ΔEM, one row per choice */

/** STRIDE itself heads the list: the zero every other row is measured from. */
const CHOICES: { stage: Stage; label: string; delta: number }[] = [
  { stage: 'none', label: 'None (STRIDE)', delta: 0 },
  ...stageEffects,
]

function buildEffect(select: (stage: Stage) => void): { el: HTMLElement; update: (stage: Stage) => void } {
  const lo = -0.045
  const hi = 0.095
  const pct = (v: number) => ((v - lo) / (hi - lo)) * 100
  const zero = pct(0)

  const list = h('ul', { class: 'pl-bars', style: `--zero:${zero}%`, 'aria-label': 'Stage that receives the guidance' })
  const rows = CHOICES.map((choice) => {
    const left = Math.min(pct(choice.delta), zero)
    const width = Math.abs(pct(choice.delta) - zero)
    const tone = choice.delta < 0 ? 'is-neg' : choice.delta > 0 ? 'is-pos' : ''
    const button = h(
      'button',
      { type: 'button', class: `pl-bar-row ${tone}`, 'aria-pressed': false },
      h('span', { class: 'pl-bar-label' }, choice.label),
      h('span', { class: 'pl-bar-track', 'aria-hidden': 'true' }, h('span', { class: 'pl-bar', style: `left:${left}%;width:${width}%` })),
      h('span', { class: 'pl-bar-value' }, choice.delta ? delta(choice.delta) : '–'),
    )
    button.addEventListener('click', () => select(choice.stage))
    list.append(h('li', {}, button))
    return { stage: choice.stage, button }
  })

  const el = h(
    'div',
    { class: 'pl-effect' },
    h('p', { class: 'pl-effect-head', 'aria-hidden': 'true' }, h('span', {}, 'Guidance added to'), h('span', {}, 'ΔEM')),
    list,
  )
  const update = (stage: Stage) => {
    for (const row of rows) row.button.setAttribute('aria-pressed', String(row.stage === stage))
  }
  return { el, update }
}

/* ---------------------------------------------------------------- mount */

export function mountPipeline(container: HTMLElement): void {
  const diagram = buildDiagram()
  const flow = buildFlow()

  const set = (stage: Stage) => {
    const guided = new Set(GUIDED[stage])
    const harmful = stage === 'retrieval'
    for (const { module, box, link, pill: tag } of diagram.insertions) {
      const on = guided.has(module)
      for (const el of [box, link, tag]) {
        el.classList.toggle('is-on', on)
        el.classList.toggle('is-miss', on && harmful)
      }
      link.setAttribute('marker-end', on ? (harmful ? 'url(#pl-head-miss)' : 'url(#pl-head-g)') : 'url(#pl-head)')
    }
    for (const [module, item] of flow.items) {
      item.classList.toggle('is-on', guided.has(module))
      item.classList.toggle('is-miss', guided.has(module) && harmful)
    }
    effect.update(stage)
  }

  const effect = buildEffect(set)
  container.append(h('div', { class: 'pl-diagram' }, diagram.svg), flow.el, effect.el)
  set('extraction+reasoning')

  // In the narrow flow, an arrow at the end of a wrapped line would point at nothing.
  const chain = flow.el.querySelector<HTMLElement>('.pf-chain')
  if (chain && typeof ResizeObserver === 'function') {
    new ResizeObserver(() => {
      const items = [...chain.children] as HTMLElement[]
      items.forEach((item, k) => item.classList.toggle('is-line-end', (items[k + 1]?.offsetTop ?? item.offsetTop) > item.offsetTop))
    }).observe(chain)
  }
}
