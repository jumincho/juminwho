<div align="center">

<img src="public/favicon.svg" width="88" alt="Mongle, the site mascot" />

# JUMIN WHO?

The one-page personal site of Jumin Cho, AI researcher and Ph.D. student in Computer Science at
Jeonbuk National University.

<https://jumincho.github.io/juminwho/>

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/preview-dark.jpg" />
  <img src="docs/preview-light.jpg" alt="The first screen: the name and a fact card on a cream background, next to a photo under cherry blossoms and a peach mascot" />
</picture>

## Features

- A soft, cozy look. Light mode is "cream morning", dark mode is "cocoa night": pastel cushion
  panels, slowly drifting blobs and a cloud-shaped footer.
- JUMIN WHO? Hover over the name, or scroll the page, and it bounces into "JUMIN WHO?".
- A live age counter, running from 1998-07-10 to eight decimal places.
- Mongle the mascot, a peach mochi that becomes the favicon, the app icons and the link-preview
  (Open Graph) image.
- Round flag stickers that show where each paper was presented.
- A theme toggle that follows the operating system until you pick one, a copy-email button and
  print styles.
- Respect for reduced motion, screen readers and keyboard navigation, with WCAG AA contrast or
  better for all text.
- One content file: every word on the page lives in `src/data/profile.ts`.

## Tech stack

Vite 7, React 19, TypeScript, CSS Modules with design tokens, Fontsource (Fredoka, Nunito and Jua)
and lucide-react. There is no router, CMS or backend. GitHub Actions builds the site and publishes
it to GitHub Pages.

## Project structure

```text
.
├── .github/workflows/deploy.yml  push to main → lint → build → deploy to GitHub Pages
├── docs/
│   ├── DESIGN.md                 design rules: colour, type, shape, motion, don'ts
│   └── preview-*.jpg             README previews (npm run snapshots -- --readme)
├── public/                       copied into the build as-is
│   ├── favicon.svg               the mascot; every other icon starts here
│   ├── favicon.ico, apple-touch-icon.png, icon-*.png, og-image.png   made by npm run icons
│   ├── manifest.webmanifest
│   ├── jumin-cho.jpg
│   └── 404.html                  sends old links (/blog, …) back to the home page
├── scripts/
│   ├── icons.mjs                 renders the icons and the link-preview image
│   ├── snapshots.mjs             visual and behaviour checks for the build
│   └── lib/browser.mjs
├── src/
│   ├── data/                     profile.ts (all content) and types.ts
│   ├── sections/                 Hero, Publications, Experience, Education, Honors
│   ├── components/               NameFlip, LiveAge, Panel, Timeline, Flag, CopyEmail, ThemeToggle, …
│   ├── layout/                   Header, Footer, Backdrop (the drifting blobs)
│   ├── hooks/                    useScrolled, useActiveSection, useTheme
│   ├── lib/                      cx, theme
│   ├── styles/                   tokens.css (design tokens), global.css, fonts.css
│   ├── App.tsx
│   └── main.tsx
├── vite-plugins/                 siteMeta (<head> tags), hangulFont (Korean font subset)
├── index.html
└── vite.config.ts
```

## Getting started

You need Node.js 20.19 or later, or 22.12 or later.

```bash
npm ci
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Type-checks, then builds into `dist/` |
| `npm run preview` | Serves the build locally |
| `npm run lint` | Runs ESLint |
| `npm run snapshots` | Checks the build at 375 px and 1280 px in light and dark, and saves screenshots to `snapshots/` |
| `npm run icons` | Redraws the favicon, the app icons and the link-preview image from `favicon.svg` |

`snapshots` and `icons` drive Chromium through Playwright. Run `npx playwright install chromium`
once, or point `PLAYWRIGHT_CHROMIUM=/path/to/chrome` at a browser you already have.

## Editing the content

Edit `src/data/profile.ts` and nothing else; components never hold facts or wording.

| Export | Holds |
| --- | --- |
| `site` | Page title, description, address and last-updated month; the `<head>` tags are built from it |
| `profile` | Name, alias, Korean name, tagline, affiliation, birth instant, email, photo and links |
| `sections` | Section order, titles and navigation labels |
| `publications`, `selfNames` | Papers, with venue and place, and the spellings of Jumin's name to highlight |
| `experience`, `education` | Timeline entries; periods are `{ from, to?, expected? }` |
| `honors`, `certifications` | Awards and certifications |
| `labels` | Greetings, labels, button names and screen-reader text |

- Korean text is welcome anywhere. The build subsets the Korean display font (Jua) to exactly the
  characters in use.
- A paper's `place` takes a city, a country and an ISO country code. Italy and Japan have flag
  drawings in `src/components/Flag.tsx`; any other code shows a map pin until you add one.
- After changing the name, tagline, affiliation or photo, run `npm run icons` so the link-preview
  image matches.

## Design

The rules live in [docs/DESIGN.md](docs/DESIGN.md), and every colour, size, radius and timing lives
in `src/styles/tokens.css`. Use a token, or add one, instead of hard-coding a value.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which lints, builds and publishes the
site to GitHub Pages. In the repository settings, Settings → Pages → Build and deployment → Source
must be set to GitHub Actions. `main` is the only branch.
