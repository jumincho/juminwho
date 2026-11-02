type Child = Node | string | number | null | undefined | false
type Attrs = Record<string, string | number | boolean | null | undefined>

function apply(el: Element, attrs: Attrs, children: Child[]): void {
  for (const [name, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) continue
    el.setAttribute(name, value === true ? '' : String(value))
  }
  for (const child of children) {
    if (child === false || child === null || child === undefined) continue
    el.append(child instanceof Node ? child : String(child))
  }
}

/** An HTML element: `h('p', { class: 'note' }, 'text', otherNode)`. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  apply(el, attrs, children)
  return el
}

const SVG_NS = 'http://www.w3.org/2000/svg'

/** An SVG element, same signature as h(). */
export function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag)
  apply(el, attrs, children)
  return el
}

/** An element parsed from trusted markup written in this codebase (icons, math). */
export function html(markup: string): DocumentFragment {
  return document.createRange().createContextualFragment(markup)
}

/** The element with this id, or an error naming it: every widget needs its mount point. */
export function byId<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null
}
