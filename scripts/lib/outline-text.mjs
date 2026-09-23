/**
 * Text → glyph outlines, so exported SVGs need no fonts at all. SVGs shown
 * through <img> (GitHub READMEs) cannot be trusted to load embedded fonts in
 * every browser; paths render the same everywhere.
 *
 * Shaping uses HarfBuzz, the same engine Chromium lays text out with, so the
 * outlined words line up with the browser's line breaks and positions.
 */
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import fontverter from 'fontverter'
import { Blob, Buffer as HbBuffer, Face, Font, Variation, shape } from 'harfbuzzjs'

const require = createRequire(import.meta.url)

/** CSS family name → font file. The first family of every exported text element must be one of these. */
const FILES = {
  'Fredoka Variable': '@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2',
  'Nunito Variable': '@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2',
  Jua: '@fontsource/jua/files/jua-korean-400-normal.woff2',
}

const loaded = new Map()

async function load(family) {
  if (!loaded.has(family)) {
    const file = FILES[family]
    if (!file) throw new Error(`No font file for family "${family}"; add it to FILES in outline-text.mjs`)
    const sfnt = await fontverter.convert(await readFile(require.resolve(file)), 'sfnt')
    const face = new Face(new Blob(sfnt), 0)
    loaded.set(family, { face, font: new Font(face) })
  }
  return loaded.get(family)
}

/** Font data URIs for the page that lays the cards out, so browser and HarfBuzz use identical files. */
export async function fontFaceCss() {
  const weights = { 'Fredoka Variable': '300 700', 'Nunito Variable': '200 1000', Jua: '400' }
  const rules = []
  for (const [family, file] of Object.entries(FILES)) {
    const data = (await readFile(require.resolve(file))).toString('base64')
    rules.push(`@font-face { font-family: '${family}'; font-weight: ${weights[family]}; src: url(data:font/woff2;base64,${data}) format('woff2'); }`)
  }
  return rules.join('\n')
}

/**
 * Shapes one line of text. Positions are in font units from the start of the
 * line, y growing downwards like SVG; `scale` converts font units to px.
 */
export async function shapeLine({ family, weight, size, letterSpacing = 0, text }) {
  const { face, font } = await load(family)
  font.setVariations([new Variation('wght', weight)])
  const buffer = new HbBuffer()
  buffer.addText(text)
  buffer.guessSegmentProperties()
  shape(font, buffer)
  const scale = size / face.upem
  const spacing = letterSpacing / scale
  let pen = 0
  const glyphs = buffer.getGlyphInfosAndPositions().map((g) => {
    if (g.codepoint === 0) {
      throw new Error(`"${family}" has no glyph for "${text[g.cluster]}" in "${text}"`)
    }
    const glyph = { id: g.codepoint, x: pen + g.xOffset, y: -g.yOffset }
    pen += g.xAdvance + spacing
    return glyph
  })
  return { glyphs, advance: pen, scale }
}

/** Joins integers, letting a minus sign stand in for the separator. */
const numbers = (list) => list.reduce((out, n, i) => out + (i > 0 && n >= 0 ? ' ' : '') + n, '')

/**
 * Compact SVG path for one glyph in whole font units, y flipped to grow
 * downwards, with relative commands. Size-independent: callers scale the
 * <use> that places it.
 */
export async function glyphPath({ family, weight, id }) {
  const { font } = await load(family)
  font.setVariations([new Variation('wght', weight)])
  const tokens = font.glyphToPath(id).match(/[MLQCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []
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
