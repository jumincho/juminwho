/**
 * Renders the project page's link-preview image.
 *
 *   npm run project-assets
 *
 * Writes public/forward-looking-guidance/og.png (1200 × 630, the URL its
 * og:image tag names) from the page's own tokens, fonts and the CIKM 2026
 * logo. Run it after changing the page's title or palette.
 */
import { mkdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { launchChromium } from './lib/browser.mjs'

const require = createRequire(import.meta.url)
const PAGE = 'forward-looking-guidance'

const tokens = await readFile(`${PAGE}/src/styles/tokens.css`, 'utf8')
const logo = `data:image/webp;base64,${(await readFile(`${PAGE}/assets/cikm-2026-light.webp`)).toString('base64')}`
const dataUri = async (file) => `data:font/woff2;base64,${(await readFile(require.resolve(file))).toString('base64')}`
const fonts = `
@font-face { font-family: 'Inter Variable'; font-weight: 100 900; src: url(${await dataUri('@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'Source Serif 4 Variable'; font-style: italic; font-weight: 200 900; src: url(${await dataUri('@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-italic.woff2')}) format('woff2'); }
@font-face { font-family: 'Source Serif 4 Variable'; font-weight: 200 900; src: url(${await dataUri('@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-normal.woff2')}) format('woff2'); }`

// Five operations: o1 resolved, o2 running, and the remaining plan G2 = (o3, o4, o5) around the rest.
const xs = [90, 330, 570, 810, 1050]
const node = (x, k, state) =>
  `<g transform="translate(${x} 96)"><circle r="30" class="n ${state}"/><text y="10" text-anchor="middle" class="l ${state}"><tspan font-style="italic">o</tspan><tspan font-size="17" dy="7">${k}</tspan></text></g>`
const diagram = `<svg viewBox="0 0 1140 170" width="1056" height="157" aria-hidden="true">
  <line x1="${xs[0]}" x2="${xs[4]}" y1="96" y2="96" class="track"/>
  <line x1="${xs[0]}" x2="${xs[1]}" y1="96" y2="96" class="done"/>
  <rect x="${xs[2] - 48}" y="48" width="${xs[4] - xs[2] + 96}" height="96" rx="48" class="region"/>
  <text x="${(xs[2] + xs[4]) / 2}" y="28" text-anchor="middle" class="g"><tspan font-style="italic">G</tspan><tspan font-size="18" dy="7">2</tspan><tspan dy="-7"> = (</tspan><tspan font-style="italic">o</tspan><tspan font-size="18" dy="7">3</tspan><tspan dy="-7">, </tspan><tspan font-style="italic">o</tspan><tspan font-size="18" dy="7">4</tspan><tspan dy="-7">, </tspan><tspan font-style="italic">o</tspan><tspan font-size="18" dy="7">5</tspan><tspan dy="-7">)</tspan></text>
  <circle cx="${xs[1]}" cy="96" r="44" class="ring"/>
  ${node(xs[0], 1, 'is-done')}${node(xs[1], 2, 'is-active')}${node(xs[2], 3, 'is-next')}${node(xs[3], 4, 'is-next')}${node(xs[4], 5, 'is-next')}
</svg>`

const card = `<!doctype html>
<html data-theme="light"><head><meta charset="utf-8"><style>
${fonts}
${tokens}
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; background: var(--bg); color: var(--ink); font-family: var(--font-sans); }
.og { position: relative; height: 100%; padding: 46px 72px; text-align: center; }
.logo { display: block; height: 92px; margin: 0 auto; }
h1 { margin-top: 20px; font-family: var(--font-serif); font-size: 52px; font-weight: 600; line-height: 1.14; letter-spacing: -0.01em; }
h1 span { display: block; }
.authors { margin-top: 18px; color: var(--ink-2); font-size: 23px; }
.diagram { position: absolute; left: 72px; right: 72px; bottom: 26px; }
.track { stroke: var(--border-strong); stroke-width: 3; stroke-dasharray: 1 10; stroke-linecap: round; }
.done { stroke: var(--ink-3); stroke-width: 3; stroke-linecap: round; }
.region { fill: var(--accent-tint); stroke: var(--accent-fill); stroke-width: 2.5; stroke-dasharray: 8 8; }
.ring { fill: none; stroke: var(--accent-ring); stroke-width: 6; }
.n { fill: var(--surface); stroke: var(--border-strong); stroke-width: 2.5; }
.n.is-done { fill: var(--ink); stroke: var(--ink); }
.n.is-active { fill: var(--accent-solid); stroke: var(--accent-solid); }
.n.is-next { stroke: var(--accent-fill); }
.l { font-family: var(--font-math); font-size: 28px; fill: var(--accent); }
.l.is-done { fill: var(--bg); } .l.is-active { fill: var(--on-accent); }
.g { font-family: var(--font-math); font-size: 30px; fill: var(--accent); }
</style></head><body><div class="og">
  <img class="logo" src="${logo}" alt="">
  <h1>Forward-Looking Guidance for Iterative RAG <span>in Multi-Hop Question Answering</span></h1>
  <p class="authors">Jumin Cho, Chanjun Park, Seung-Hoon Na, Hyun-Je Song</p>
  <div class="diagram">${diagram}</div>
</div></body></html>`

const browser = await launchChromium()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(card)
await page.evaluate(() => document.fonts.ready)
await page.waitForFunction(() => document.querySelector('.logo').complete)
await mkdir(`public/${PAGE}`, { recursive: true })
await page.screenshot({ path: `public/${PAGE}/og.png` })
await browser.close()
console.log(`public/${PAGE}/og.png`)
