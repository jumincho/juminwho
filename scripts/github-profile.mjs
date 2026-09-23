/**
 * Builds the GitHub profile README (the jumincho/jumincho repository) from
 * the same content, tokens, fonts, flags and mascot as the site.
 *
 *   npm run github-profile                # writes into ../jumincho
 *   npm run github-profile -- <checkout>  # or into another checkout
 *
 * Every image is laid out in Chromium with cards.css, exported to SVG with
 * outlined text (no fonts, so it renders the same in every browser GitHub
 * serves) in a light and a dark version. Writes README.md, assets/*.svg,
 * scripts/update-age.mjs and .github/workflows/age.yml into the checkout;
 * commit and push there. Run it after changing src/data/profile.ts.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { createServer } from 'vite'
import { buildCards, rows } from './github-profile/cards.mjs'
import { buildReadme } from './github-profile/readme.mjs'
import { launchChromium } from './lib/browser.mjs'
import { exportScene } from './lib/export-scene.mjs'
import { fontFaceCss } from './lib/outline-text.mjs'
import { sceneToSvg } from './lib/scene-to-svg.mjs'

const target = resolve(process.argv[2] ?? '../jumincho')
const here = new URL('./github-profile/', import.meta.url)

// A dev server in SSR mode loads the site's TSX and CSS modules as the app sees them.
const vite = await createServer({
  server: { middlewareMode: true, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: 'error',
})
const [content, flagModule, brand] = await Promise.all(
  ['/src/data/profile.ts', '/src/components/Flag.tsx', '/src/components/BrandIcons.tsx'].map((id) => vite.ssrLoadModule(id)),
)
await vite.close()

const mascot = (await readFile('public/favicon.svg', 'utf8')).replace(/<!--[\s\S]*?-->/g, '').trim()
const photo = `data:image/jpeg;base64,${(await readFile(`public/${content.profile.photo.src}`)).toString('base64')}`
const { html, frames, age } = buildCards(content, { Flag: flagModule.default, LinkedInIcon: brand.LinkedInIcon, mascot, photo })

const page = `<!doctype html>
<html data-theme="light"><head><meta charset="utf-8"><style>
${await fontFaceCss()}
${await readFile('src/styles/tokens.css', 'utf8')}
${await readFile('src/styles/tones.css', 'utf8')}
${await readFile(new URL('cards.css', here), 'utf8')}
</style></head><body>${html}</body></html>`
const animations = await readFile(new URL('animations.css', here), 'utf8')

const browser = await launchChromium()
const tab = await browser.newPage({ viewport: { width: 1000, height: 900 } })
await tab.setContent(page, { waitUntil: 'load' })
await tab.evaluate(() => document.fonts.ready)

// Cards shown side by side get the same height: the shorter one's last panel grows.
await tab.evaluate((pairs) => {
  for (const pair of pairs) {
    const [a, b] = pair.map((id) => document.querySelector(`[data-frame="${id}"]`))
    const shorter = a.offsetHeight < b.offsetHeight ? a : b
    const panel = [...shorter.querySelectorAll('.panel')].at(-1)
    panel.style.minHeight = `${panel.offsetHeight + Math.abs(a.offsetHeight - b.offsetHeight)}px`
  }
}, rows)

await rm(join(target, 'assets'), { recursive: true, force: true })
await mkdir(join(target, 'assets'), { recursive: true })
await mkdir(join(target, 'scripts'), { recursive: true })
await mkdir(join(target, '.github/workflows'), { recursive: true })

const sizes = {}
let bytes = 0
for (const theme of ['light', 'dark']) {
  await tab.evaluate((t) => (document.documentElement.dataset.theme = t), theme)
  const shadow = await tab.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--shadow-rgb').trim().split(/\s+/).join(','))
  for (const frame of frames) {
    const scene = await tab.locator(`[data-frame="${frame.id}"]`).evaluate(exportScene)
    const svg = await sceneToSvg(scene, { shadow, css: frame.animated ? animations : '', label: frame.alt })
    await writeFile(join(target, 'assets', `${frame.id}-${theme}.svg`), svg)
    sizes[frame.id] = { width: Math.ceil(scene.width), height: Math.ceil(scene.height) }
    bytes += svg.length
  }
}
await browser.close()

await writeFile(join(target, 'README.md'), buildReadme({ frames, rows, sizes, content }))
const updater = await readFile(new URL('update-age.mjs', here), 'utf8')
await writeFile(join(target, 'scripts/update-age.mjs'), updater.replace('__BIRTH__', content.profile.birth))
await writeFile(join(target, '.github/workflows/age.yml'), await readFile(new URL('age.yml', here), 'utf8'))

console.log(`✓ ${frames.length * 2} SVGs (${(bytes / 1024).toFixed(0)} kB), README.md, age updater → ${target}`)
console.log(`  age drawn as ${age}`)
