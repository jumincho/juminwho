/**
 * Visual and behavioural checks for the built site (docs/DESIGN.md, "Before you push").
 *
 *   npm run build && npm run snapshots
 *   npm run snapshots -- --readme     # also refresh docs/preview-{light,dark}.jpg
 *
 * Serves dist/ with Vite's preview server and drives Chromium at 375 px and
 * 1280 px in light and dark. Fails on console errors or failed requests,
 * horizontal overflow, a header nav that does not fit, broken images or
 * icons, fonts that did not load, a frozen age counter or clock, a missing
 * "JUMIN WHO?" after hover or scroll, a theme toggle or Local | Jumin switch
 * that does nothing, a status without "maybe…", a status that disagrees with
 * Jumin's routine at fixed moments, animations that keep running with
 * reduced motion, or a language (every one in profile.ts, at both widths)
 * that does not switch, does not fit or loses its hedge, or a language menu
 * that does not pick, remember and link. Full-page screenshots go to
 * snapshots/ (git-ignored) for a side-by-side look against the last build.
 */
import { mkdir } from 'node:fs/promises'
import { preview } from 'vite'
import { launchChromium } from './lib/browser.mjs'
import { loadModules } from './lib/load-modules.mjs'

const OUT = 'snapshots'
const ALIAS = 'JUMIN WHO?'
const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
]
const schemes = ['light', 'dark']
const writeReadmePreviews = process.argv.includes('--readme')

/** Moments in KST and what the clock card must say then (juminTime.routine in profile.ts). */
const routineCases = [
  ['2026-09-23T08:30:00', 'ready'], // Wednesday
  ['2026-09-23T10:00:00', 'working'],
  ['2026-09-23T22:00:00', 'superposition'],
  ['2026-09-24T00:59:00', 'superposition'], // the evening lasts until 01:00
  ['2026-09-24T01:00:00', 'asleep'],
  ['2026-09-26T00:30:00', 'superposition'], // Saturday, Friday's evening still going
  ['2026-09-26T12:00:00', 'superposition'],
  ['2026-09-27T03:00:00', 'asleep'], // Sunday
  ['2026-09-28T00:30:00', 'superposition'], // Monday, Sunday's evening still going
  ['2026-09-28T08:30:00', 'ready'],
]

const [content] = await loadModules(['/src/data/profile.ts'])
const server = await preview({ preview: { port: 4173 }, logLevel: 'warn' }) // next free port if taken
const url = server.resolvedUrls.local[0]
const browser = await launchChromium()
const failures = []

/** Opacity of the "JUMIN WHO?" face inside `selector`, or 0 when it is missing. */
const aliasOpacity = (page, selector) =>
  page.evaluate(
    ([sel, alias]) => {
      const face = [...document.querySelectorAll(`${sel} [aria-hidden="true"]`)].find((el) => el.textContent === alias)
      return face ? Number(getComputedStyle(face).opacity) : 0
    },
    [selector, ALIAS],
  )

async function checkPage(vp, scheme) {
  const tag = `${vp.name}/${scheme}`
  const fail = (message) => failures.push(`${tag}: ${message}`)
  const context = await browser.newContext({ viewport: vp, colorScheme: scheme })
  const page = await context.newPage()

  page.on('console', (message) => message.type() === 'error' && fail(`console error: ${message.text()}`))
  page.on('pageerror', (error) => fail(`page error: ${error.message}`))
  page.on('requestfailed', (request) => fail(`request failed: ${request.url()}`))
  page.on('response', (response) => response.status() >= 400 && fail(`HTTP ${response.status()}: ${response.url()}`))

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  const state = await page.evaluate(async () => {
    const heads = [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')]
    const manifestUrl = document.querySelector('link[rel="manifest"]')?.href
    const manifest = manifestUrl ? await fetch(manifestUrl).then((r) => r.json()).catch(() => ({ icons: [] })) : { icons: [] }
    const ogImage = document.querySelector('meta[property="og:image"]')?.content ?? 'og-image.png'
    const assets = [
      ...heads.map((link) => link.href),
      ...manifest.icons.map((icon) => new URL(icon.src, manifestUrl).href),
      // og:image points at the live site; check the same file on this server.
      new URL(ogImage.split('/').pop(), location.href).href,
    ]
    const missing = []
    if (manifest.icons.length === 0) missing.push(`${manifestUrl} (no icons)`)
    for (const asset of assets) if (!(await fetch(asset)).ok) missing.push(asset)
    const nav = document.querySelector('header nav ul')
    return {
      theme: document.documentElement.dataset.theme,
      scrollWidth: document.documentElement.scrollWidth,
      navOverflow: nav.scrollWidth - nav.clientWidth,
      brokenImages: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
      missing,
      // document.fonts.check() is true for families that do not exist, so look for loaded faces.
      fonts: ['Fredoka Variable', 'Nunito Variable', 'Jua'].filter(
        (family) => ![...document.fonts].some((face) => face.family.replace(/"/g, '') === family && face.status === 'loaded'),
      ),
    }
  })

  if (state.theme !== scheme) fail(`data-theme is "${state.theme}", expected "${scheme}"`)
  if (state.scrollWidth > vp.width) fail(`horizontal overflow (${state.scrollWidth}px > ${vp.width}px)`)
  if (state.navOverflow > 0) fail(`header nav is ${state.navOverflow}px too wide`)
  for (const src of state.brokenImages) fail(`image did not load: ${src}`)
  for (const asset of state.missing) fail(`missing asset: ${asset}`)
  for (const font of state.fonts) fail(`font not loaded: ${font}`)

  // The 8th decimal of a year moves every ~0.32 s, so 700 ms always shows a change.
  const counter = page.locator('[data-live-age]')
  const before = await counter.textContent()
  await page.waitForTimeout(700)
  if ((await counter.textContent()) === before) fail('age counter is not ticking')

  const clock = page.locator('[data-clock]')
  const shown = await clock.textContent()
  await page.waitForTimeout(1100)
  if ((await clock.textContent()) === shown) fail('the Jumin clock is not ticking')
  const unhedged = await page.$$eval(
    '[data-state-label]',
    (labels, hedge) => labels.map((label) => label.textContent.trim()).filter((text) => !text.startsWith(hedge)),
    content.juminTime.maybe.en,
  )
  for (const text of unhedged) fail(`status "${text}" does not start with "${content.juminTime.maybe.en}"`)

  await page.screenshot({ path: `${OUT}/${vp.name}-${scheme}.png`, fullPage: true, animations: 'disabled' })
  if (writeReadmePreviews && vp.name === 'desktop') {
    await page.screenshot({ path: `docs/preview-${scheme}.jpg`, type: 'jpeg', quality: 85, animations: 'disabled' })
  }

  if (vp.name === 'desktop') {
    await page.hover('h1 > span')
    await page.waitForTimeout(700)
    if ((await aliasOpacity(page, 'h1')) < 0.99) fail('hovering the name does not show the alias')
    await page.mouse.move(0, vp.height - 1)
    await page.waitForTimeout(700)
    if ((await aliasOpacity(page, 'h1')) > 0.01) fail('the alias stays after the pointer leaves')
  }

  await page.mouse.wheel(0, 240)
  await page.waitForTimeout(700)
  if ((await aliasOpacity(page, 'h1')) < 0.99) fail('the hero name does not flip after scrolling')
  if ((await aliasOpacity(page, 'header')) < 0.99) fail('the header name does not flip after scrolling')
  await page.screenshot({ path: `${OUT}/${vp.name}-${scheme}-scrolled.png`, animations: 'disabled' })

  const toggle = page.locator('header button[data-current]')
  await toggle.click()
  const flipped = await page.evaluate(() => document.documentElement.dataset.theme)
  await toggle.click()
  const restored = await page.evaluate(() => document.documentElement.dataset.theme)
  if (flipped === scheme || restored !== scheme) fail(`theme toggle went ${scheme} → ${flipped} → ${restored}`)

  for (const mode of ['local', 'jumin']) {
    await page.locator(`label[for="clock-${mode}"]`).click()
    if ((await page.locator('fieldset[data-mode]').getAttribute('data-mode')) !== mode) fail(`the clock switch does not pick ${mode}`)
  }

  await context.close()
  console.log(`${failures.some((f) => f.startsWith(tag)) ? '✗' : '✓'} ${tag}`)
}

/** With reduced motion only the age counter may move, and it still ticks once a second. */
async function checkReducedMotion() {
  const context = await browser.newContext({ viewport: viewports[0], reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.mouse.wheel(0, 240)
  await page.waitForTimeout(400)
  const running = await page.evaluate(() =>
    document.getAnimations().filter((animation) => animation.playState === 'running').length,
  )
  if (running > 0) failures.push(`reduced motion: ${running} animation(s) still running`)
  const counter = page.locator('[data-live-age]')
  const before = await counter.textContent()
  await page.waitForTimeout(1200)
  if ((await counter.textContent()) === before) failures.push('reduced motion: age counter stopped')
  const clock = page.locator('[data-clock]')
  const shown = await clock.textContent()
  await page.waitForTimeout(1100)
  if ((await clock.textContent()) === shown) failures.push('reduced motion: the Jumin clock stopped')
  await context.close()
  console.log(`${failures.some((f) => f.startsWith('reduced motion')) ? '✗' : '✓'} reduced motion`)
}

/** The status card at fixed moments, seen from Los Angeles so the two clocks differ. */
async function checkRoutine() {
  const context = await browser.newContext({ viewport: viewports[0], timezoneId: 'America/Los_Angeles' })
  const page = await context.newPage()
  for (const [kst, expected] of routineCases) {
    await page.clock.setFixedTime(new Date(`${kst}+09:00`))
    await page.goto(url, { waitUntil: 'networkidle' })
    const status = await page.locator('[data-status]').getAttribute('data-status')
    if (status !== expected) failures.push(`routine: at ${kst} KST the card says "${status}", expected "${expected}"`)
  }
  await context.close()
  console.log(`${failures.some((f) => f.startsWith('routine')) ? '✗' : '✓'} routine (${routineCases.length} moments)`)
}

/** Every other language at both widths (desktop light, mobile dark): it switches, fits and stays hedged. */
async function checkLanguage(vp, code) {
  const scheme = vp.name === 'desktop' ? 'light' : 'dark'
  const tag = `${vp.name}/${code}`
  const fail = (message) => failures.push(`${tag}: ${message}`)
  const context = await browser.newContext({ viewport: vp, colorScheme: scheme })
  const page = await context.newPage()
  page.on('console', (message) => message.type() === 'error' && fail(`console error: ${message.text()}`))
  page.on('pageerror', (error) => fail(`page error: ${error.message}`))
  page.on('requestfailed', (request) => fail(`request failed: ${request.url()}`))

  await page.goto(`${url}?lang=${code}`, { waitUntil: 'networkidle' })
  const state = await page.evaluate(() => {
    const nav = document.querySelector('header nav ul')
    return {
      lang: document.documentElement.lang,
      scrollWidth: document.documentElement.scrollWidth,
      navOverflow: nav.scrollWidth - nav.clientWidth,
      title: document.querySelector('#publications h2')?.textContent,
      status: document.querySelector('[data-state-label]')?.textContent.trim(),
      jua: [...document.fonts].filter((face) => face.family.replace(/"/g, '') === 'Jua' && face.status === 'loaded').length,
    }
  })
  if (state.lang !== code) fail(`<html lang> is "${state.lang}"`)
  if (state.scrollWidth > vp.width) fail(`horizontal overflow (${state.scrollWidth}px > ${vp.width}px)`)
  if (state.navOverflow > 0) fail(`header nav is ${state.navOverflow}px too wide`)
  if (state.title !== content.sections.publications.title[code]) fail(`Publications heading reads "${state.title}"`)
  if (!state.status?.startsWith(content.juminTime.maybe[code])) fail(`status "${state.status}" does not start with "${content.juminTime.maybe[code]}"`)
  // Korean headings need the full Jua subset besides the one for the name.
  if (code === 'ko' && state.jua < 2) fail('the Korean Jua subset did not load')

  await page.screenshot({ path: `${OUT}/${vp.name}-${code}.png`, fullPage: true, animations: 'disabled' })
  await context.close()
  console.log(`${failures.some((f) => f.startsWith(tag)) ? '✗' : '✓'} ${tag}`)
}

/** Picking a language in the menu switches the page, puts it in the address and remembers it. */
async function checkLanguageMenu() {
  const fail = (message) => failures.push(`language menu: ${message}`)
  const context = await browser.newContext({ viewport: viewports[0] })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  const pick = async (name) => {
    await page.locator('header button[aria-haspopup="menu"]').click()
    await page.getByRole('menuitemradio', { name }).click()
  }
  const [target, english] = [content.languages.at(-2), content.languages[0]]

  if ((await page.evaluate(() => document.documentElement.lang)) !== english.code) fail('the page does not start in English')
  await pick(target.name)
  const picked = await page.evaluate(() => ({ lang: document.documentElement.lang, search: location.search, stored: localStorage.getItem('juminwho:lang') }))
  if (picked.lang !== target.code) fail(`picking ${target.name} left <html lang> at "${picked.lang}"`)
  if (picked.search !== `?lang=${target.code}`) fail(`the address reads "${picked.search}"`)
  if (picked.stored !== target.code) fail('the choice was not stored')
  await page.goto(url, { waitUntil: 'networkidle' })
  if ((await page.evaluate(() => document.documentElement.lang)) !== target.code) fail('the stored choice is not used on the next visit')
  await pick(english.name)
  if ((await page.evaluate(() => location.search)) !== '') fail('English still carries ?lang= in the address')

  await context.close()
  console.log(`${failures.some((f) => f.startsWith('language menu')) ? '✗' : '✓'} language menu`)
}

try {
  await mkdir(OUT, { recursive: true })
  for (const vp of viewports) for (const scheme of schemes) await checkPage(vp, scheme)
  await checkReducedMotion()
  await checkRoutine()
  for (const vp of viewports) for (const { code } of content.languages.slice(1)) await checkLanguage(vp, code)
  await checkLanguageMenu()
} finally {
  await browser.close()
  await server.close()
}

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed:\n${failures.map((f) => `  - ${f}`).join('\n')}`)
  process.exit(1)
}
console.log(`\nAll checks passed. Screenshots are in ${OUT}/${writeReadmePreviews ? ', README previews in docs/' : ''}.`)
