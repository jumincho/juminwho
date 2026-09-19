/**
 * Visual check for docs/DESIGN.md's merge checklist.
 *
 *   npm run build && npm run snapshots
 *
 * Builds are served from dist/ with `vite preview`; screenshots land in snapshots/
 * (git-ignored). The script fails when the page overflows horizontally, when the
 * age counter stops ticking, or when the scrolled state does not show the alias.
 *
 * Needs the `playwright` package and a Chromium it can launch. Set
 * PLAYWRIGHT_CHROMIUM to an executable path to skip `npx playwright install chromium`.
 */
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const PORT = 4173
const BASE = `http://localhost:${PORT}/`
const OUT = 'snapshots'

const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
]
const schemes = ['light', 'dark']

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 1500))

let failures = 0
try {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined })

  for (const vp of viewports) {
    for (const scheme of schemes) {
      const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme })
      const page = await ctx.newPage()
      await page.goto(BASE, { waitUntil: 'networkidle' })

      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth)
      if (scrollW > vp.width) {
        failures++
        console.error(`✗ ${vp.name}/${scheme}: horizontal overflow (${scrollW}px > ${vp.width}px)`)
      }

      const counter = page.locator('h1 ~ * >> text=/^\\d+\\.\\d{12}$/').first()
      const a = await counter.textContent()
      await page.waitForTimeout(100)
      const b = await counter.textContent()
      if (a === b) {
        failures++
        console.error(`✗ ${vp.name}/${scheme}: age counter is not ticking`)
      }

      await page.screenshot({ path: `${OUT}/${vp.name}-${scheme}.png`, fullPage: true })

      await page.mouse.wheel(0, 200)
      await page.waitForTimeout(500)
      const aliasOpacity = await page.evaluate(() => {
        const el = [...document.querySelectorAll('h1 span')].find((s) => s.textContent === 'JUMIN WHO?')
        return el ? Number(getComputedStyle(el).opacity) : 0
      })
      if (aliasOpacity < 0.99) {
        failures++
        console.error(`✗ ${vp.name}/${scheme}: alias not shown after scroll (opacity ${aliasOpacity})`)
      }
      await page.screenshot({ path: `${OUT}/${vp.name}-${scheme}-scrolled.png` })

      console.log(`✓ ${vp.name}/${scheme}`)
      await ctx.close()
    }
  }
  await browser.close()
} finally {
  preview.kill()
}

if (failures > 0) {
  console.error(`${failures} check(s) failed`)
  process.exit(1)
}
console.log(`Screenshots written to ${OUT}/`)
