/**
 * Prints the CIKM 2026 poster (forward-looking-guidance/poster.html) to an A0 portrait PDF.
 *
 *   npm run poster
 *
 * Serves the page with Vite, opens it in Chromium with reduced motion (every figure in one
 * complete, still state), and checks it before printing: every figure mounted, nothing runs
 * past the sheet, and no text (subscripts aside) is smaller than 16 pt at A0. Then writes dist-poster/poster.pdf
 * (841 × 1189 mm, text and figures as vectors, fonts embedded as TrueType, never Type 3) and a PNG
 * preview beside it.
 */
import { mkdir } from 'node:fs/promises'
import { createServer } from 'vite'
import { launchChromium } from './lib/browser.mjs'

const OUT = 'dist-poster'
const CANVAS = { width: 1540, height: 2178 }
/** pt on the A0 sheet per canvas px: 841 mm / 1540 px, in points (1 pt = 25.4 / 72 mm). */
const PT_PER_PX = 841 / 1540 / (25.4 / 72)
const MIN_PT = 16

const server = await createServer({ server: { port: 4190 }, logLevel: 'warn' })
await server.listen()
const url = `${server.resolvedUrls.local[0]}forward-looking-guidance/poster.html`
const browser = await launchChromium()
const failures = []

try {
  const page = await browser.newPage({ viewport: CANVAS, reducedMotion: 'reduce', colorScheme: 'light' })
  page.on('console', (message) => message.type() === 'error' && failures.push(`console error: ${message.text()}`))
  page.on('pageerror', (error) => failures.push(`page error: ${error.message}`))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('html[data-poster-ready]', { timeout: 15000 })

  const report = await page.evaluate(
    ({ ptPerPx, minPt }) => {
      const count = (selector) => document.querySelectorAll(selector).length
      const poster = document.querySelector('.poster')
      const box = poster.getBoundingClientRect()
      const padBottom = parseFloat(getComputedStyle(poster).paddingBottom)
      // The last block must end inside the sheet's bottom margin.
      const lastBottom = Math.max(...[...poster.children].map((child) => child.getBoundingClientRect().bottom))
      // Every piece of visible text, HTML and SVG: its size on paper.
      const small = []
      const walker = document.createTreeWalker(poster, NodeFilter.SHOW_TEXT)
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const el = node.parentElement
        if (!node.textContent.trim() || !el || el.closest('[aria-hidden="true"], .visually-hidden')) continue
        // Subscripts are smaller by design: <sub> in HTML, a tspan shifted down in SVG.
        if (el.closest('sub') || (el.tagName === 'tspan' && parseFloat(el.getAttribute('dy') ?? '0') > 0)) continue
        const style = getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden' || !el.getClientRects().length) continue
        const pt = parseFloat(style.fontSize) * ptPerPx
        if (pt < minPt) small.push(`${node.textContent.trim().slice(0, 30)} (${pt.toFixed(1)} pt)`)
      }
      return {
        figures: {
          teaser: count('#hero-visual svg .hero-node'),
          motivation: count('#fig-motivation .mv-cell'),
          effect: count('#fig-pipeline .pl-bar-row'),
          table: count('#tbl-results tbody tr'),
          depth: count('#fig-depth .ps-dp-row'),
          case: count('.ps-case-table tbody tr'),
          qr: count('#qr svg'),
        },
        overflow: Math.round(lastBottom - (box.bottom - padBottom)),
        small: [...new Set(small)],
      }
    },
    { ptPerPx: PT_PER_PX, minPt: MIN_PT },
  )
  for (const [figure, n] of Object.entries(report.figures)) if (n === 0) failures.push(`figure "${figure}" did not mount`)
  if (report.overflow > 0) failures.push(`the content runs ${report.overflow} px past the bottom margin`)
  for (const text of report.small) failures.push(`text below ${MIN_PT} pt at A0: ${text}`)

  await mkdir(OUT, { recursive: true })
  await page.screenshot({ path: `${OUT}/poster.png` })

  // Scale the canvas up to the sheet, and print with the screen styles the poster was laid out in.
  await page.evaluate(() => document.documentElement.classList.add('is-print'))
  await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' })
  const pdf = await page.pdf({ path: `${OUT}/poster.pdf`, preferCSSPageSize: true, printBackground: true })
  // A character outside the static fonts' subsets falls back to a system font, which Chromium may
  // write as a Type 3 font. Some print preflights reject those.
  if (pdf.includes('/Type3')) failures.push('a glyph went into the PDF as a Type 3 font: a character outside the static font subsets?')
} finally {
  await browser.close()
  await server.close()
}

if (failures.length) {
  console.error(`${failures.length} check(s) failed:\n${failures.map((f) => `  - ${f}`).join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`${OUT}/poster.pdf (A0 portrait) and ${OUT}/poster.png`)
}
