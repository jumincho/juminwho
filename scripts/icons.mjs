/**
 * Renders every icon and the link-preview image from public/favicon.svg,
 * src/styles/tokens.css and the text in src/data/profile.ts.
 *
 *   npm run icons
 *
 * Writes to public/: favicon.ico (16 + 32 px), apple-touch-icon.png (180),
 * icon-192.png, icon-512.png, icon-maskable-512.png and og-image.png
 * (1200 × 630). Run it after changing the mascot, the palette or the name.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { runnerImport } from 'vite'
import { launchChromium } from './lib/browser.mjs'

const require = createRequire(import.meta.url)
const { module: content } = await runnerImport('./src/data/profile.ts')
const { labels, profile } = content

const mascot = await readFile('public/favicon.svg', 'utf8')
const mascotUri = `data:image/svg+xml;base64,${Buffer.from(mascot).toString('base64')}`
const tokens = await readFile('src/styles/tokens.css', 'utf8')

const dataUri = async (path, type) => `data:${type};base64,${(await readFile(path)).toString('base64')}`
const fontFace = async (family, file, weight) =>
  `@font-face { font-family: '${family}'; font-weight: ${weight}; src: url(${await dataUri(require.resolve(file), 'font/woff2')}) format('woff2'); }`

const fonts = [
  await fontFace('Fredoka Variable', '@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2', '300 700'),
  await fontFace('Nunito Variable', '@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2', '200 1000'),
  await fontFace('Jua', '@fontsource/jua/files/jua-korean-400-normal.woff2', '400'),
].join('\n')

const page = (body, css = '') => `<!doctype html>
<html data-theme="light"><head><meta charset="utf-8"><style>
${fonts}
${tokens}
* { box-sizing: border-box; margin: 0; }
html, body { background: transparent; }
${css}
</style></head><body>${body}</body></html>`

/** The mascot centred on a square, `scale` of the side, optionally on the page colour. */
const iconPage = (scale, background) =>
  page(
    `<img src="${mascotUri}">`,
    `body { width: 100vw; height: 100vh; display: grid; place-items: center; ${background ? 'background: var(--bg);' : ''} }
     img { width: ${scale * 100}vw; height: ${scale * 100}vw; }`,
  )

// Link previews speak the default language, English.
const ogPage = page(
  `<div class="blob a"></div><div class="blob b"></div><div class="blob c"></div><div class="blob d"></div>
   <main>
     <p class="greeting">${labels.greeting.en}</p>
     <h1>${profile.name}</h1>
     <p class="ko">${profile.nameKo}</p>
     <p class="tagline">${profile.tagline.en}</p>
     <p class="role">${profile.role.en}</p>
     <p class="role">${labels.affiliationOrder.en(profile.department.label.en, profile.university.label.en).join('')}</p>
   </main>
   <figure>
     <div class="halo"></div>
     <img class="photo" src="${await dataUri(`public/${profile.photo.src}`, 'image/jpeg')}">
     <img class="mascot" src="${mascotUri}">
     <p class="bubble">${profile.alias}</p>
   </figure>`,
  `body { position: relative; width: 1200px; height: 630px; overflow: hidden; background: var(--bg); color: var(--ink); font-family: var(--font-body); }
   .blob { position: absolute; border-radius: 50%; opacity: var(--blob-opacity); }
   .a { width: 760px; height: 760px; left: -300px; top: -360px; background: radial-gradient(closest-side, var(--blob-a), transparent); }
   .b { width: 620px; height: 620px; right: -220px; top: -180px; background: radial-gradient(closest-side, var(--blob-b), transparent); }
   .c { width: 700px; height: 700px; left: 180px; bottom: -420px; background: radial-gradient(closest-side, var(--blob-c), transparent); }
   .d { width: 520px; height: 520px; right: 20px; bottom: -300px; background: radial-gradient(closest-side, var(--blob-d), transparent); }
   main { position: absolute; left: 84px; top: 88px; width: 620px; }
   .greeting { display: inline-block; padding: 8px 22px; border-radius: 999px; background: var(--surface); box-shadow: var(--shadow-sm); color: var(--ink-soft); font-size: 24px; font-weight: 700; }
   h1 { margin-top: 20px; font-family: var(--font-display); font-size: 118px; font-weight: 700; line-height: 1; letter-spacing: -0.01em; }
   .ko { display: inline-block; margin-top: 14px; padding: 0 8px; font-family: var(--font-display); font-size: 42px; color: var(--ink-soft); background: linear-gradient(transparent 58%, var(--highlight) 58% 90%, transparent 90%); }
   .tagline { margin-top: 22px; font-size: 30px; font-weight: 700; line-height: 1.3; text-wrap: balance; }
   .tagline + .role { margin-top: 14px; }
   .role { font-size: 23px; font-weight: 600; line-height: 1.45; color: var(--ink-soft); }
   figure { position: absolute; right: 92px; top: 124px; width: 372px; height: 372px; }
   .halo { position: absolute; inset: 5% -7% -6% 9%; border-radius: var(--blob-2); background: var(--butter-pop); opacity: 0.6; }
   .photo { position: relative; width: 100%; height: 100%; object-fit: cover; border: 9px solid var(--surface); border-radius: var(--blob-1); box-shadow: var(--shadow-lg); }
   .mascot { position: absolute; left: -44px; bottom: -34px; width: 118px; filter: drop-shadow(0 10px 14px rgb(var(--shadow-rgb) / 0.25)); }
   .bubble { position: absolute; left: 64px; bottom: 76px; padding: 8px 18px; border-radius: 999px; background: var(--ink); color: var(--bg); font-family: var(--font-display); font-size: 26px; font-weight: 600; white-space: nowrap; }
   .bubble::after { content: ''; position: absolute; left: 14px; bottom: -8px; width: 18px; height: 18px; background: inherit; border-radius: 0 0 6px 0; transform: rotate(45deg); }`,
)

/** Packs PNG images into one .ico file (PNG-in-ICO, supported everywhere since Windows Vista). */
function toIco(images) {
  const header = Buffer.alloc(6 + 16 * images.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, png }, i) => {
    const entry = 6 + 16 * i
    header.writeUInt8(size >= 256 ? 0 : size, entry)
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1)
    header.writeUInt16LE(1, entry + 4) // colour planes
    header.writeUInt16LE(32, entry + 6) // bits per pixel
    header.writeUInt32LE(png.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += png.length
  })
  return Buffer.concat([header, ...images.map((image) => image.png)])
}

const browser = await launchChromium()

async function render(html, width, height, transparent) {
  const tab = await browser.newPage({ viewport: { width, height } })
  await tab.setContent(html, { waitUntil: 'load' })
  await tab.evaluate(() => document.fonts.ready)
  const png = await tab.screenshot({ omitBackground: transparent })
  await tab.close()
  return png
}

const outputs = {
  'apple-touch-icon.png': await render(iconPage(0.78, true), 180, 180, false),
  'icon-192.png': await render(iconPage(1), 192, 192, true),
  'icon-512.png': await render(iconPage(1), 512, 512, true),
  // Maskable icons are cropped to a circle of 80% of the side; keep the mascot inside it.
  'icon-maskable-512.png': await render(iconPage(0.6, true), 512, 512, false),
  'favicon.ico': toIco([
    { size: 16, png: await render(iconPage(1), 16, 16, true) },
    { size: 32, png: await render(iconPage(1), 32, 32, true) },
  ]),
  'og-image.png': await render(ogPage, 1200, 630, false),
}
await browser.close()

for (const [name, data] of Object.entries(outputs)) {
  await writeFile(`public/${name}`, data)
  console.log(`✓ public/${name} (${(data.length / 1024).toFixed(1)} kB)`)
}
