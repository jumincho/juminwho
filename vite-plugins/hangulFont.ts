import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import subsetFont from 'subset-font'
import type { Plugin } from 'vite'

const MODULE_ID = 'virtual:hangul-font.css'
const RESOLVED_ID = `\0${MODULE_ID}`
const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/g
const HANGUL_RANGES = 'U+1100-11FF, U+3130-318F, U+AC00-D7AF'

/**
 * Serves `virtual:hangul-font.css`: an @font-face for Jua holding only the
 * Hangul characters that occur in `text`, inlined as a data URI. The page
 * uses a handful of Korean characters, and the full font's unicode-range
 * slices would add ~130 kB of render-blocking CSS. Adding Korean to
 * profile.ts restarts the dev server (it is a config dependency), so the
 * subset stays in step without a manual step.
 */
export function hangulFont(text: string, family = 'Jua'): Plugin {
  const characters = [...new Set(text.match(HANGUL))].sort().join('')
  let css: Promise<string> | undefined

  const build = async () => {
    if (!characters) return ''
    const require = createRequire(import.meta.url)
    const source = await readFile(require.resolve('@fontsource/jua/files/jua-korean-400-normal.woff2'))
    const subset = await subsetFont(source, characters, { targetFormat: 'woff2' })
    return `/* ${family}, subset to: ${characters} */
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,${subset.toString('base64')}) format('woff2');
  unicode-range: ${HANGUL_RANGES};
}
`
  }

  return {
    name: 'hangul-font',
    resolveId: (id) => (id === MODULE_ID ? RESOLVED_ID : undefined),
    load(id) {
      if (id !== RESOLVED_ID) return
      css ??= build()
      return css
    },
  }
}
