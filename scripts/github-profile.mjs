/**
 * Builds the GitHub profile README (the jumincho/jumincho repository) in
 * every language of the site, from the same content, tokens, fonts, flags
 * and mascot.
 *
 *   npm run github-profile                # writes into ../jumincho
 *   npm run github-profile -- <checkout>  # or into another checkout
 *
 * Every image is laid out in Chromium with cards.css and exported to SVG with
 * outlined text (no fonts, so it renders the same in every browser GitHub
 * serves) in a light and a dark version. Writes into the checkout:
 * README.md (English, shown on the profile) and README.<code>.md for the
 * other languages, assets/<code>/*.svg, assets/lang/*.svg (the language
 * pills), scripts/update-age.mjs and .github/workflows/age.yml. Commit and
 * push there. Run it after changing src/data/profile.ts.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { buildCards, buildLanguagePills, rows } from './github-profile/cards.mjs'
import { buildReadme, readmeName } from './github-profile/readme.mjs'
import { launchChromium } from './lib/browser.mjs'
import { exportScene } from './lib/export-scene.mjs'
import { fontFaceRules, fontFile } from './lib/fonts.mjs'
import { loadModules } from './lib/load-modules.mjs'
import { sceneToSvg } from './lib/scene-to-svg.mjs'

const target = resolve(process.argv[2] ?? '../jumincho')
const here = new URL('./github-profile/', import.meta.url)
/** A made-up origin: requests to it are answered from memory and node_modules. */
const ORIGIN = 'https://cards.local'

const [content, flagModule, brand] = await loadModules([
  '/src/data/profile.ts',
  '/src/components/Flag.tsx',
  '/src/components/BrandIcons.tsx',
])
const mascot = (await readFile('public/favicon.svg', 'utf8')).replace(/<!--[\s\S]*?-->/g, '').trim()
const photo = `data:image/jpeg;base64,${(await readFile(`public/${content.profile.photo.src}`)).toString('base64')}`
const assets = { Flag: flagModule.default, LinkedInIcon: brand.LinkedInIcon, mascot, photo }

const styles = [
  await fontFaceRules(),
  await readFile('src/styles/tokens.css', 'utf8'),
  await readFile('src/styles/tones.css', 'utf8'),
  await readFile(new URL('cards.css', here), 'utf8'),
].join('\n')
const animations = await readFile(new URL('animations.css', here), 'utf8')

const browser = await launchChromium()
const tab = await browser.newPage({ viewport: { width: 1000, height: 900 } })
let pageHtml = ''
await tab.route(`${ORIGIN}/**`, async (route) => {
  const { pathname } = new URL(route.request().url())
  if (pathname === '/') return route.fulfill({ contentType: 'text/html; charset=utf-8', body: pageHtml })
  const font = pathname.startsWith('/fonts/') ? await fontFile(pathname.slice('/fonts/'.length)) : null
  return font ? route.fulfill({ contentType: 'font/woff2', body: font }) : route.fulfill({ status: 404, body: '' })
})

/**
 * Lays `html` out as a page in `lang`, makes the paired frames equally tall
 * (the shorter one's last panel grows) and exports every frame to SVG in
 * light and dark.
 */
async function render(lang, html, frames, pairs = []) {
  pageHtml = `<!doctype html>
<html lang="${lang}" data-theme="light"><head><meta charset="utf-8"><style>${styles}</style></head><body>${html}</body></html>`
  await tab.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' })
  await tab.evaluate(() => document.fonts.ready)
  await tab.evaluate((pairs) => {
    for (const pair of pairs) {
      const [a, b] = pair.map((id) => document.querySelector(`[data-frame="${id}"]`))
      const shorter = a.offsetHeight < b.offsetHeight ? a : b
      const panel = [...shorter.querySelectorAll('.panel')].at(-1)
      panel.style.minHeight = `${panel.offsetHeight + Math.abs(a.offsetHeight - b.offsetHeight)}px`
    }
  }, pairs)

  const images = []
  for (const theme of ['light', 'dark']) {
    await tab.evaluate((t) => (document.documentElement.dataset.theme = t), theme)
    const shadow = await tab.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--shadow-rgb').trim().split(/\s+/).join(','),
    )
    for (const frame of frames) {
      const scene = await tab.locator(`[data-frame="${frame.id}"]`).evaluate(exportScene)
      const svg = await sceneToSvg(scene, { shadow, css: frame.animated ? animations : '', label: frame.alt })
      images.push({ id: frame.id, theme, svg, width: Math.ceil(scene.width), height: Math.ceil(scene.height) })
    }
  }
  return images
}

// Start from a clean slate: the images and the per-language READMEs.
await rm(join(target, 'assets'), { recursive: true, force: true })
for (const file of await readdir(target)) {
  if (/^README\.[\w-]+\.md$/.test(file)) await rm(join(target, file))
}
await mkdir(join(target, 'scripts'), { recursive: true })
await mkdir(join(target, '.github/workflows'), { recursive: true })

const sizes = {}
let count = 0
let bytes = 0
async function write(dir, images) {
  await mkdir(join(target, dir), { recursive: true })
  for (const image of images) {
    await writeFile(join(target, dir, `${image.id}-${image.theme}.svg`), image.svg)
    sizes[image.id] = { width: image.width, height: image.height }
    count++
    bytes += image.svg.length
  }
}

const pills = buildLanguagePills(content)
await write('assets/lang', await render('en', pills.html, pills.frames))

let age = ''
for (const { code } of content.languages) {
  const cards = buildCards(content, code, assets)
  age = cards.age
  await write(`assets/${code}`, await render(code, cards.html, cards.frames, rows))
  await writeFile(
    join(target, readmeName(code)),
    buildReadme({ lang: code, frames: cards.frames, pills: pills.frames, rows, sizes, content }),
  )
}
await browser.close()

const glances = content.languages.flatMap(({ code }) => ['light', 'dark'].map((theme) => `assets/${code}/glance-${theme}.svg`))
const updater = await readFile(new URL('update-age.mjs', here), 'utf8')
await writeFile(
  join(target, 'scripts/update-age.mjs'),
  updater.replace('__BIRTH__', content.profile.birth).replace(`['__FILES__']`, JSON.stringify(glances, null, 2)),
)
await writeFile(join(target, '.github/workflows/age.yml'), await readFile(new URL('age.yml', here), 'utf8'))

console.log(`✓ ${count} SVGs (${(bytes / 1024).toFixed(0)} kB), ${content.languages.length} READMEs, age updater → ${target}`)
console.log(`  age drawn as ${age}`)
