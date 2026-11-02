import { s } from './dom'

/**
 * Math set by hand, from a small TeX-like notation: "G_i = (o_{i+1}, …, o_n)".
 * A single Latin letter is a variable and goes italic; longer words such as
 * LLM or Retrieve stay upright, as do digits and operators. `_x` or `_{…}` is
 * a subscript. The same source renders as HTML (for text) or as SVG tspans
 * (for figures), so labels look alike everywhere.
 */
interface Token {
  text: string
  italic: boolean
  sub: boolean
}

function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  const push = (text: string, sub: boolean) => {
    for (const part of text.match(/[A-Za-z]+|[^A-Za-z]+/g) ?? []) {
      tokens.push({ text: part, italic: /^[A-Za-z]$/.test(part), sub })
    }
  }
  let plain = ''
  for (let i = 0; i < source.length; i++) {
    if (source[i] !== '_') {
      plain += source[i]
      continue
    }
    if (plain) push(plain, false)
    plain = ''
    if (source[i + 1] === '{') {
      const end = source.indexOf('}', i + 2)
      push(source.slice(i + 2, end), true)
      i = end
    } else {
      push(source[i + 1], true)
      i += 1
    }
  }
  if (plain) push(plain, false)
  return tokens
}

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Markup for inline math: `<span class="m"><i>G</i><sub><i>i</i></sub></span>`. */
export function mathHtml(source: string, className = 'm'): string {
  let out = ''
  let sub = ''
  const flush = () => {
    if (sub) out += `<sub>${sub}</sub>`
    sub = ''
  }
  for (const token of tokenize(source)) {
    let piece = escape(token.text).replace(/⊕/g, '<span class="op">⊕</span>')
    if (token.italic) piece = `<i>${piece}</i>`
    if (token.sub) {
      sub += piece
    } else {
      flush()
      out += piece
    }
  }
  flush()
  return `<span class="${className}">${out}</span>`
}

/**
 * The same math as SVG tspans for a <text> of `fontSize` px. SVG has no
 * subscript element, so subscripts shift down by an absolute `dy` and the
 * next normal run shifts back (em-based dy would differ between the sizes).
 */
export function mathTspans(source: string, fontSize: number, className = 'svg-math'): SVGTSpanElement[] {
  const shift = Math.round(fontSize * 0.28 * 10) / 10
  let shifted = false
  // ⊕ gets a tspan of its own, so it can take a math face at text size (see .svg-op).
  const tokens = tokenize(source).flatMap((token) =>
    token.text.includes('⊕') && token.text !== '⊕'
      ? token.text.split(/(⊕)/).filter(Boolean).map((text) => ({ ...token, text }))
      : [token],
  )
  return tokens.map((token) => {
    if (token.text === '⊕' && !token.sub) {
      const op = s('tspan', { class: `${className} svg-op`, 'font-size': String(Math.round(fontSize * 0.86 * 10) / 10) }, '⊕')
      if (shifted) {
        op.setAttribute('dy', String(-shift))
        shifted = false
      }
      return op
    }
    // Variables take the math face in italic; words keep the face of the surrounding text.
    const span = s('tspan', { class: token.italic ? `${className} is-var` : className }, token.text)
    if (token.italic) span.setAttribute('font-style', 'italic')
    if (token.sub) span.setAttribute('font-size', String(Math.round(fontSize * 0.72 * 10) / 10))
    if (token.sub !== shifted) {
      span.setAttribute('dy', String(token.sub ? shift : -shift))
      shifted = token.sub
    }
    return span
  })
}
