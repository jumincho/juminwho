/**
 * Turns a scene from export-scene.mjs into a standalone SVG. Text becomes
 * outlined glyphs: each glyph is defined once per face and weight, in font
 * units, and every run of a line (the stretch set in one face) is a scaled
 * group of <use> elements. Boxes become paths, and data-anim groups get
 * classes for the CSS passed in `css`.
 *
 * Digits in a data-age element are drawn from fixed glyph ids (age-0 … age-9,
 * age-dot) inside <g id="age">, so a script without fonts can rewrite the
 * number later: see github-profile/update-age.mjs.
 */
import { glyphPath, shapeText } from './fonts.mjs'

const round = (n) => Math.round(n * 100) / 100
const xml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

/** CSS rgb()/rgba() → SVG paint and opacity. */
function paint(color) {
  const m = color.match(/rgba?\(([^)]+)\)/)
  if (!m) return { color, opacity: 1 }
  const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean)
  return { color: `rgb(${r},${g},${b})`, opacity: Number(a) }
}

const fillAttrs = (color, attr = 'fill') => {
  const { color: c, opacity } = paint(color)
  return `${attr}="${c}"${opacity < 1 ? ` ${attr}-opacity="${round(opacity)}"` : ''}`
}

/** A rectangle with elliptical corners (CSS border-radius), optionally inset for borders. */
function roundedRect({ x, y, w, h, radius }, inset = 0) {
  const X = x + inset
  const Y = y + inset
  const W = w - 2 * inset
  const H = h - 2 * inset
  const r = (corner) => corner.map((v) => Math.max(0, v - inset))
  const [tlx, tly] = r(radius.tl)
  const [trx, try_] = r(radius.tr)
  const [brx, bry] = r(radius.br)
  const [blx, bly] = r(radius.bl)
  const n = (v) => round(v)
  return [
    `M${n(X + tlx)},${n(Y)}H${n(X + W - trx)}`,
    `A${n(trx)},${n(try_)} 0 0 1 ${n(X + W)},${n(Y + try_)}V${n(Y + H - bry)}`,
    `A${n(brx)},${n(bry)} 0 0 1 ${n(X + W - brx)},${n(Y + H)}H${n(X + blx)}`,
    `A${n(blx)},${n(bly)} 0 0 1 ${n(X)},${n(Y + H - bly)}V${n(Y + tly)}`,
    `A${n(tlx)},${n(tly)} 0 0 1 ${n(X + tlx)},${n(Y)}Z`,
  ].join('')
}

/**
 * @param scene   result of exportScene
 * @param options.shadow   rgb triple for the drop shadows, e.g. "124,76,44"
 * @param options.css      extra CSS (animations) placed in the SVG
 * @param options.label    accessible name of the image
 */
export async function sceneToSvg(scene, { shadow, css = '', label = '' }) {
  const defs = []
  const body = []
  const glyphIds = new Map()
  let uid = 0
  const nextId = (prefix) => `${prefix}${(uid++).toString(36)}`

  async function glyphRef(run, glyph) {
    const key = `${run.font}|${run.weight}|${glyph}`
    if (!glyphIds.has(key)) {
      const d = await glyphPath({ font: run.font, weight: run.weight, glyph })
      glyphIds.set(key, d ? nextId('g') : null)
      if (d) defs.push(`<path id="${glyphIds.get(key)}" d="${d}"/>`)
    }
    return glyphIds.get(key)
  }

  /** Glyph <use>s in font units inside one translated, scaled group. */
  const runGroup = (x, y, scale, inner, attrs = '') =>
    `<g${attrs} transform="translate(${round(x)} ${round(y)}) scale(${Number(scale.toPrecision(5))})">${inner}</g>`

  /** A line of text: one group per run, sharing the line's fill. */
  async function textRun(item) {
    const groups = []
    for (const run of (await shapeText(item)).runs) {
      const uses = []
      for (const g of run.glyphs) {
        const ref = await glyphRef(run, g.id)
        if (ref) uses.push(`<use href="#${ref}" x="${Math.round(g.x)}"${g.y ? ` y="${Math.round(g.y)}"` : ''}/>`)
      }
      if (uses.length > 0) groups.push([item.x + run.x, run.scale, uses.join('')])
    }
    if (groups.length === 1) return runGroup(groups[0][0], item.y, groups[0][1], groups[0][2], ` ${fillAttrs(item.color)}`)
    return `<g ${fillAttrs(item.color)}>${groups.map(([x, scale, inner]) => runGroup(x, item.y, scale, inner)).join('')}</g>`
  }

  /** Age digits reference fixed ids so update-age.mjs can swap them without fonts. */
  async function ageRun(item) {
    const advances = {}
    let scale = 1
    for (const ch of '0123456789.') {
      const [run] = (await shapeText({ ...item, text: ch })).runs
      defs.push(`<path id="age-${ch === '.' ? 'dot' : ch}" d="${await glyphPath({ font: run.font, weight: run.weight, glyph: run.glyphs[0].id })}"/>`)
      advances[ch] = Math.round(run.advance)
      scale = run.scale
    }
    let x = 0
    const uses = [...item.text].map((ch) => {
      const use = `<use href="#age-${ch === '.' ? 'dot' : ch}" x="${x}"/>`
      x += advances[ch]
      return use
    })
    const attrs = ` id="age" data-digit="${advances['0']}" data-dot="${advances['.']}" ${fillAttrs(item.color)}`
    return runGroup(item.x, item.y, scale, uses.join(''), attrs)
  }

  for (const item of scene.items) {
    switch (item.type) {
      case 'box': {
        const filter = item.shadow ? ` filter="url(#shadow-${item.shadow})"` : ''
        if (item.fill) body.push(`<path d="${roundedRect(item)}" ${fillAttrs(item.fill)}${filter}/>`)
        if (item.border) {
          const dash = item.dashed ? ` stroke-dasharray="${round(item.border * 3)} ${round(item.border * 2)}"` : ''
          body.push(
            `<path d="${roundedRect(item, item.border / 2)}" fill="none" ${fillAttrs(item.borderColor, 'stroke')} stroke-width="${item.border}"${dash}${item.fill ? '' : filter}/>`,
          )
        }
        break
      }
      case 'clip-start': {
        const id = nextId('c')
        defs.push(`<clipPath id="${id}"><path d="${roundedRect(item)}"/></clipPath>`)
        body.push(`<g clip-path="url(#${id})">`)
        break
      }
      case 'group-start':
        body.push(`<g${item.anim ? ` class="${item.anim}"` : ''}${item.opacity < 1 ? ` opacity="${round(item.opacity)}"` : ''}>`)
        break
      case 'clip-end':
      case 'group-end':
        body.push('</g>')
        break
      case 'text':
        body.push(item.age ? await ageRun(item) : await textRun(item))
        break
      case 'svg':
        // Nested drawings may carry ids (the mascot's gradient); keep them unique per file.
        body.push(item.markup.replace(/\bid="([^"]+)"/g, (_, id) => `id="${id}-${uid}"`).replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${id}-${uid})`))
        uid++
        break
      case 'img': {
        const id = nextId('c')
        defs.push(`<clipPath id="${id}"><path d="${roundedRect(item)}"/></clipPath>`)
        const filter = item.shadow ? ` filter="url(#shadow-${item.shadow})"` : ''
        // Backing shape for the shadow, in the frame colour so no dark fringe shows at the edge.
        body.push(`<path d="${roundedRect(item)}" ${fillAttrs(item.border ? item.borderColor : 'rgb(255,255,255)')}${filter}/>`)
        body.push(
          `<image href="${item.href}" x="${round(item.x)}" y="${round(item.y)}" width="${round(item.w)}" height="${round(item.h)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`,
        )
        if (item.border) {
          body.push(`<path d="${roundedRect(item, item.border / 2)}" fill="none" ${fillAttrs(item.borderColor, 'stroke')} stroke-width="${item.border}"/>`)
        }
        break
      }
      case 'radial': {
        const id = nextId('r')
        const { color, opacity } = paint(item.color)
        defs.push(
          `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`,
        )
        body.push(`<ellipse cx="${round(item.x + item.w / 2)}" cy="${round(item.y + item.h / 2)}" rx="${round(item.w / 2)}" ry="${round(item.h / 2)}" fill="url(#${id})"/>`)
        break
      }
      case 'vline': {
        const x = round(item.x + item.w / 2)
        body.push(
          `<line x1="${x}" y1="${round(item.y)}" x2="${x}" y2="${round(item.y + item.h)}" ${fillAttrs(item.color, 'stroke')} stroke-width="${round(item.w)}" stroke-linecap="round" stroke-dasharray="0 ${round(item.w * 2.5)}"/>`,
        )
        break
      }
      default:
        throw new Error(`Unknown scene item: ${item.type}`)
    }
  }

  // Kept small enough to fit the frames' padding (cards.css, .frame).
  const shadows = [
    ['sm', 2, 3, 0.14],
    ['md', 5, 6, 0.18],
    ['lg', 10, 12, 0.24],
  ].map(
    ([name, dy, blur, alpha]) =>
      `<filter id="shadow-${name}" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="${dy}" stdDeviation="${blur}" flood-color="rgb(${shadow})" flood-opacity="${alpha}"/></filter>`,
  )

  const w = Math.ceil(scene.width)
  const h = Math.ceil(scene.height)
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${xml(label)}">`,
    `<title>${xml(label)}</title>`,
    `<defs>${shadows.join('')}${defs.join('')}</defs>`,
    css ? `<style>${css}</style>` : '',
    body.join(''),
    '</svg>',
  ].join('')
}
