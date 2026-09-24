/**
 * The fonts the GitHub profile cards are laid out and outlined with: the
 * site's Fredoka, Nunito and Jua, plus Noto Sans for Chinese, Japanese and
 * Korean text. Chromium lays the cards out with exactly these files (see
 * fontFaceRules), and HarfBuzz turns the text into outlines with them, so the
 * exported SVGs need no fonts at all. SVGs shown through <img> (GitHub
 * READMEs) cannot be trusted to load embedded fonts in every browser; paths
 * render the same everywhere.
 *
 * Most families come as Fontsource unicode-range slices. A character is set
 * in the first family of the element's font-family list that has a face
 * covering it and a glyph for it, which is what a browser's font fallback
 * does, so the outlines line up with Chromium's layout.
 */
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { basename, dirname, join } from 'node:path'
import fontverter from 'fontverter'
import { Blob, Buffer as HbBuffer, Face, Font, Variation, shape } from 'harfbuzzjs'

const require = createRequire(import.meta.url)

/** Fontsource stylesheets (every slice of a family), or a single file with its range. */
const SOURCES = [
  { css: '@fontsource-variable/fredoka/wght.css' },
  { css: '@fontsource-variable/nunito/wght.css' },
  {
    family: 'Jua',
    weight: '400',
    file: '@fontsource/jua/files/jua-korean-400-normal.woff2',
    range: 'U+1100-11FF, U+3130-318F, U+AC00-D7AF',
  },
  { css: '@fontsource-variable/noto-sans-kr/wght.css' },
  { css: '@fontsource-variable/noto-sans-jp/wght.css' },
  { css: '@fontsource-variable/noto-sans-sc/wght.css' },
  { css: '@fontsource-variable/noto-sans-hk/wght.css' },
]

/** "U+0-FF,U+131,U+4??" → [[0, 255], [305, 305], [1024, 1279]] */
function parseRanges(text) {
  return text.split(',').map((part) => {
    const [lo, hi = lo] = part.trim().replace(/^U\+/i, '').split('-')
    return lo.includes('?') ? [parseInt(lo.replace(/\?/g, '0'), 16), parseInt(lo.replace(/\?/g, 'f'), 16)] : [parseInt(lo, 16), parseInt(hi, 16)]
  })
}

let facesPromise

/** Every face: { id, family, weight, path, ranges, variable }, in stylesheet order. */
function allFaces() {
  facesPromise ??= (async () => {
    const faces = []
    for (const source of SOURCES) {
      if (source.file) {
        const path = require.resolve(source.file)
        faces.push({ id: basename(path), family: source.family, weight: source.weight, path, ranges: parseRanges(source.range), variable: false })
        continue
      }
      const cssPath = require.resolve(source.css)
      const css = await readFile(cssPath, 'utf8')
      for (const [, body] of css.matchAll(/@font-face\s*{([^}]*)}/g)) {
        const family = body.match(/font-family:\s*'([^']+)'/)[1]
        const weight = body.match(/font-weight:\s*([^;]+);/)[1].trim()
        const path = join(dirname(cssPath), body.match(/src:\s*url\(([^)]+)\)/)[1])
        const range = body.match(/unicode-range:\s*([^;]+);/)
        faces.push({ id: basename(path), family, weight, path, ranges: range ? parseRanges(range[1]) : [[0, 0x10ffff]], variable: /\s/.test(weight) })
      }
    }
    return faces
  })()
  return facesPromise
}

/** @font-face rules for the page that lays the cards out; `url` maps a face id to where the page fetches it. */
export async function fontFaceRules(url = (id) => `/fonts/${id}`) {
  const range = (face) => face.ranges.map(([lo, hi]) => `U+${lo.toString(16)}${hi > lo ? `-${hi.toString(16)}` : ''}`).join(',')
  return (await allFaces())
    .map(
      (face) =>
        `@font-face { font-family: '${face.family}'; font-weight: ${face.weight}; src: url(${url(face.id)}) format('woff2'); unicode-range: ${range(face)}; }`,
    )
    .join('\n')
}

/** The file behind a face id from fontFaceRules, for serving it to the layout page. */
export async function fontFile(id) {
  const face = (await allFaces()).find((f) => f.id === id)
  return face ? readFile(face.path) : null
}

const loaded = new Map()

/** HarfBuzz objects for a face, loaded once. */
function load(face) {
  if (!loaded.has(face.id)) {
    loaded.set(
      face.id,
      (async () => {
        const sfnt = await fontverter.convert(await readFile(face.path), 'sfnt')
        const hbFace = new Face(new Blob(sfnt), 0)
        return { face, hbFace, hbFont: new Font(hbFace), upem: hbFace.upem }
      })(),
    )
  }
  return loaded.get(face.id)
}

const setWeight = (font, weight) => {
  if (font.face.variable) font.hbFont.setVariations([new Variation('wght', weight)])
}

/** The loaded face that draws `codePoint`: the first family in `families` with a face covering it and a glyph for it. */
async function fontFor(families, codePoint) {
  const faces = await allFaces()
  for (const family of families) {
    for (const face of faces) {
      if (face.family !== family || !face.ranges.some(([lo, hi]) => codePoint >= lo && codePoint <= hi)) continue
      const font = await load(face)
      if (font.hbFont.nominalGlyph(codePoint) !== undefined) return font
    }
  }
  return null
}

/**
 * Shapes one line of text into runs, one per stretch of characters set in
 * the same face. Each run has its glyphs in font units from the run's start,
 * y growing downwards like SVG, its `advance` in font units, its `scale`
 * (font units → px) and its `x` in px from the start of the line.
 */
export async function shapeText({ families, weight, size, letterSpacing = 0, text }) {
  const pieces = []
  for (const character of text) {
    const font = await fontFor(families, character.codePointAt(0))
    if (!font) throw new Error(`No font in ${families.join(', ')} draws "${character}" (U+${character.codePointAt(0).toString(16)}) in "${text}"`)
    const last = pieces.at(-1)
    if (last && last.font === font) last.text += character
    else pieces.push({ font, text: character })
  }

  const runs = []
  let x = 0
  for (const { font, text: runText } of pieces) {
    setWeight(font, weight)
    const buffer = new HbBuffer()
    buffer.addText(runText)
    buffer.guessSegmentProperties()
    shape(font.hbFont, buffer)
    const scale = size / font.upem
    const spacing = letterSpacing / scale
    let pen = 0
    const glyphs = buffer.getGlyphInfosAndPositions().map((g) => {
      const glyph = { id: g.codepoint, x: pen + g.xOffset, y: -g.yOffset }
      pen += g.xAdvance + spacing
      return glyph
    })
    runs.push({ font: font.face.id, weight, glyphs, advance: pen, scale, x })
    x += pen * scale
  }
  return { runs, width: x }
}

/** Joins integers, letting a minus sign stand in for the separator. */
const numbers = (list) => list.reduce((out, n, i) => out + (i > 0 && n >= 0 ? ' ' : '') + n, '')

/**
 * Compact SVG path for one glyph of a face (an id from shapeText's runs), in
 * whole font units, y flipped to grow downwards, with relative commands.
 * Size-independent: callers scale the <use> that places it.
 */
export async function glyphPath({ font: id, weight, glyph }) {
  const face = (await allFaces()).find((f) => f.id === id)
  const font = await load(face)
  setWeight(font, weight)
  const tokens = font.hbFont.glyphToPath(glyph).match(/[MLQCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []
  const points = { M: 1, L: 1, Q: 2, C: 3 }
  let out = ''
  let [cx, cy, sx, sy] = [0, 0, 0, 0]
  for (let i = 0; i < tokens.length; ) {
    const command = tokens[i++].toUpperCase()
    if (command === 'Z') {
      out += 'z'
      ;[cx, cy] = [sx, sy]
      continue
    }
    const deltas = []
    let [x, y] = [cx, cy]
    for (let k = 0; k < points[command]; k++) {
      x = Math.round(Number(tokens[i++]))
      y = Math.round(-Number(tokens[i++]))
      deltas.push(x - cx, y - cy)
    }
    out += command.toLowerCase() + numbers(deltas)
    ;[cx, cy] = [x, y]
    if (command === 'M') [sx, sy] = [x, y]
  }
  return out
}
