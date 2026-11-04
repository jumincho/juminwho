// Static cuts, not the page's variable fonts: Chromium writes variable fonts into a PDF as Type 3
// glyph procedures, which some print preflights reject; static ones go in as ordinary TrueType.
import '@fontsource/inter/400.css'
import '@fontsource/inter/400-italic.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/600-italic.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/700-italic.css'
import '@fontsource/inter/800.css'
import '@fontsource/source-serif-4/400.css'
import '@fontsource/source-serif-4/400-italic.css'
import '@fontsource/source-serif-4/600.css'
import '@fontsource/source-serif-4/600-italic.css'
import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/figures.css'
import './poster.css'

import QRCode from 'qrcode'
import { byId, html } from '../lib/dom'
import { mountGains } from '../widgets/gains'
import { mountHero } from '../widgets/hero'
import { mountMotivation } from '../widgets/motivation'
import { mountPipeline } from '../widgets/pipeline'

/**
 * The poster (poster.html): the project page's own figures, drawn for paper.
 * `npm run poster` opens it with reduced motion, so every figure shows one
 * complete, still state, and waits for `data-poster-ready` before printing.
 */

/** Where the QR code on the poster leads. */
const PROJECT_PAGE = 'https://jumincho.github.io/juminwho/forward-looking-guidance/'

function mount(id: string, run: (el: HTMLElement) => void): void {
  const el = byId(id)
  if (el) run(el)
}

mount('hero-visual', (el) => mountHero(el))
mount('fig-motivation', (el) => mountMotivation(el, null))
mount('fig-gains', (el) => mountGains(el, null))
mount('fig-pipeline', (el) => mountPipeline(el))

async function finish(): Promise<void> {
  // A vector QR code with no margin of its own: the poster's layout keeps the quiet zone around it.
  const svg = await QRCode.toString(PROJECT_PAGE, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#0b0f17', light: '#ffffff' } })
  byId('qr')?.replaceChildren(html(svg))
  await document.fonts.ready
  // Two frames, so the charts that redraw on resize have settled.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  document.documentElement.dataset.posterReady = 'true'
}

void finish()
