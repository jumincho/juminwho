import '@fontsource-variable/inter/opsz.css'
import '@fontsource-variable/source-serif-4/opsz.css'
import '@fontsource-variable/source-serif-4/opsz-italic.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import '@fontsource/allura/latin-400.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/figures.css'
import './styles/mark.css'

import { byId } from './lib/dom'
import { initCopy, initReveal, initScroll, initTheme } from './widgets/chrome'
import { mountDepth } from './widgets/depth'
import { mountGains } from './widgets/gains'
import { mountHero } from './widgets/hero'
import { mountMark } from './widgets/mark'
import { mountMotivation } from './widgets/motivation'
import { mountPipeline } from './widgets/pipeline'
import { mountResults } from './widgets/results'
import { mountRoute } from './widgets/route'
import { mountTokens } from './widgets/tokens'
import { mountTrace } from './widgets/trace'

initTheme()
initScroll()
initReveal()
initCopy()

/** Mounts a figure if its slot is on the page; one failing figure must not take the others down. */
function mount(id: string, run: (el: HTMLElement) => void): void {
  const el = byId(id)
  if (!el) return
  try {
    run(el)
  } catch (error) {
    console.error(`Figure #${id} failed to render`, error)
  }
}

mount('title-mark', (el) => mountMark(el))
mount('hero-visual', (el) => mountHero(el))
mount('fig-motivation', (el) => mountMotivation(el, byId('motivation-tools')))
mount('fig-pipeline', (el) => mountPipeline(el, byId('pipeline-tools')))
mount('fig-gains', (el) => mountGains(el, byId('gains-tools')))
mount('table-results', (el) => mountResults(el, byId('results-tools')))
mount('fig-depth', (el) => mountDepth(el))
mount('fig-tokens', (el) => mountTokens(el, byId('tokens-legend')))
mount('fig-trace', (el) => mountTrace(el, byId('trace-tools')))

const map = document.querySelector<HTMLElement>('.pc-map')
if (map) mountRoute(map)
