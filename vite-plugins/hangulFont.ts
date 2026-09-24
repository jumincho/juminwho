import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import subsetFont from 'subset-font'
import type { Plugin } from 'vite'

/** Imported by main.tsx on every page: just the characters of the name (조주민). */
const NAME_MODULE = 'virtual:hangul-font.css'
/** Imported on demand once the page is in Korean: every Hangul character the site uses. */
const KOREAN_MODULE = 'virtual:hangul-font-ko.css'

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/g
const HANGUL_RANGES = 'U+1100-11FF, U+3130-318F, U+AC00-D7AF'

const uniqueHangul = (text: string) => [...new Set(text.match(HANGUL))].sort().join('')
const codePoints = (characters: string) =>
  [...characters].map((c) => `U+${c.codePointAt(0)!.toString(16).toUpperCase()}`).join(', ')

/**
 * Serves two @font-face sheets for Jua, each holding only the Hangul it needs,
 * inlined as data URIs (the full font's unicode-range slices would add ~130 kB
 * of render-blocking CSS):
 *   virtual:hangul-font.css     the characters of `name`, limited to exactly
 *                               those code points, so other Korean text never
 *                               waits for it
 *   virtual:hangul-font-ko.css  every Hangul character in `text` (the Korean
 *                               translations), for the Korean page's headings
 * Editing profile.ts restarts the dev server (it is a config dependency), so
 * both subsets stay in step without a manual step.
 */
export function hangulFont({ name, text, family = 'Jua' }: { name: string; text: string; family?: string }): Plugin {
  const sheets = new Map<string, Promise<string>>()

  const build = async (characters: string, unicodeRange: string) => {
    if (!characters) return ''
    const require = createRequire(import.meta.url)
    const source = await readFile(require.resolve('@fontsource/jua/files/jua-korean-400-normal.woff2'))
    const subset = await subsetFont(source, characters, { targetFormat: 'woff2' })
    return `/* ${family}, subset to ${characters.length} characters */
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,${subset.toString('base64')}) format('woff2');
  unicode-range: ${unicodeRange};
}
`
  }

  const sheet = (id: string) => {
    if (!sheets.has(id)) {
      const nameCharacters = uniqueHangul(name)
      sheets.set(
        id,
        id === NAME_MODULE
          ? build(nameCharacters, codePoints(nameCharacters))
          : build(uniqueHangul(`${name}${text}`), HANGUL_RANGES),
      )
    }
    return sheets.get(id)!
  }

  return {
    name: 'hangul-font',
    resolveId: (id) => (id === NAME_MODULE || id === KOREAN_MODULE ? `\0${id}` : undefined),
    load(id) {
      if (id === `\0${NAME_MODULE}` || id === `\0${KOREAN_MODULE}`) return sheet(id.slice(1))
    },
  }
}
