<div align="center">

<img src="public/favicon.svg" width="88" alt="Mongle, the site mascot" />

# JUMIN WHO?

The one-page personal site of Jumin Cho, AI researcher and Ph.D. student in Computer Science at
Jeonbuk National University.

<https://jumincho.github.io/juminwho/>

English · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-HK.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

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
- What time is it for Jumin? A clock card with a Local | Jumin switch shows Jumin's time (KST) or
  yours, and what Jumin is maybe doing right now by a weekday and weekend routine that stays behind
  the scenes: maybe… working, maybe… getting ready for work, maybe… asleep, or maybe… in
  superposition, every state at once until measured.
- Five languages: English (the default), 简体中文, 繁體中文, 日本語 and 한국어, picked from a menu
  in the header. The choice is remembered, and a link such as `?lang=ja` opens the page in that
  language.
- Mongle the mascot, a peach mochi that becomes the favicon, the app icons and the link-preview
  (Open Graph) image.
- Round flag stickers in front of places: where Jumin is based, and where each paper was presented.
- A theme toggle that follows the operating system until you pick one, a copy-email button and
  print styles.
- Respect for reduced motion, screen readers and keyboard navigation, with WCAG AA contrast or
  better for all text.
- One content file: every word on the page, in every language, lives in `src/data/profile.ts`.
- A matching GitHub profile README in the same five languages, drawn from the same data and design
  by `npm run github-profile`.

## Tech stack

Vite 7, React 19, TypeScript, CSS Modules with design tokens, Fontsource (Fredoka, Nunito and Jua)
and lucide-react. Chinese and Japanese use the visitor's system fonts. There is no router, CMS or
backend. GitHub Actions builds the site and publishes it to GitHub Pages.

## Project structure

```text
.
├── .github/workflows/deploy.yml  push to main → lint → build → deploy to GitHub Pages
├── docs/
│   ├── DESIGN.md                 design rules: colour, type, shape, motion, languages, don'ts
│   └── preview-*.jpg             README previews (npm run snapshots -- --readme)
├── public/                       copied into the build as-is
│   ├── favicon.svg               the mascot; every other icon starts here
│   ├── favicon.ico, apple-touch-icon.png, icon-*.png, og-image.png   made by npm run icons
│   ├── manifest.webmanifest
│   ├── jumin-cho.jpg
│   └── 404.html                  sends old links (/blog, …) back to the home page
├── scripts/
│   ├── icons.mjs                 renders the icons and the link-preview image
│   ├── snapshots.mjs             visual and behaviour checks for the build, in every language
│   ├── github-profile.mjs        builds the GitHub profile README (jumincho/jumincho)
│   ├── github-profile/           its cards, animations, README template and daily age updater
│   └── lib/                      Chromium launcher, fonts, HTML → SVG export with outlined text
├── src/
│   ├── data/                     profile.ts (all content, in five languages) and types.ts
│   ├── sections/                 Hero, JuminTime (the clock card), Publications, Experience, Education, Honors
│   ├── components/               NameFlip, LiveAge, Panel, Timeline, Flag, PlaceName, LanguageMenu, …
│   ├── layout/                   Header, Footer, Backdrop (the drifting blobs)
│   ├── hooks/                    useLanguage, useScrolled, useActiveSection, useTheme, useNow, useClockMode
│   ├── lib/                      i18n, theme, clock (time zones and Jumin's routine), cx
│   ├── styles/                   tokens.css (design tokens), tones.css, global.css, fonts.css
│   ├── App.tsx
│   └── main.tsx
├── vite-plugins/                 siteMeta (<head> tags), hangulFont (Korean font subsets)
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
| `npm run snapshots` | Checks the build at 375 px and 1280 px, in light and dark and in every language, and saves screenshots to `snapshots/` |
| `npm run icons` | Redraws the favicon, the app icons and the link-preview image from `favicon.svg` |
| `npm run github-profile` | Rebuilds the GitHub profile READMEs and their images in `../jumincho` (see below) |

`snapshots`, `icons` and `github-profile` drive Chromium through Playwright. Run
`npx playwright install chromium` once, or point `PLAYWRIGHT_CHROMIUM=/path/to/chrome` at a browser
you already have.

## Editing the content

Edit `src/data/profile.ts` and nothing else; components never hold facts or wording.

| Export | Holds |
| --- | --- |
| `languages` | The languages in menu order, with their region tags, own names and date locales |
| `site` | Page title, description, address and last-updated month; the `<head>` tags are built from it |
| `profile` | Name, alias, Korean name, tagline, affiliation, location, birth instant, email, photo and links |
| `sections` | Section order, titles and navigation labels |
| `publications`, `selfNames` | Papers, with venue and place, and the spellings of Jumin's name to highlight |
| `experience`, `education` | Timeline entries; periods are `{ from, to?, expected? }` |
| `honors`, `certifications` | Awards and certifications |
| `juminTime` | The clock card: Jumin's time zone, the weekday and weekend routine, and its wording |
| `labels` | Greetings, labels, button names and screen-reader text |
| `githubProfile` | The few words and addresses used only by the GitHub profile README |

- Text is `Localized`: one entry per language, `{ en, 'zh-CN', 'zh-HK', ja, ko }`. TypeScript
  refuses a missing translation. Proper names stay as they are: paper titles, authors and venues
  as published, and the lab, LinkedIn and GitHub.
- Korean text is welcome anywhere. The build subsets the Korean display font (Jua) to exactly the
  characters in use: the three of 조주민 on every page, the rest only once the page is in Korean.
- Places (`profile.location` and each paper's `place`) take a city, a country and an ISO country
  code. Korea, Italy and Japan have flag drawings in `src/components/Flag.tsx`; any other code
  shows a map pin until you add one.
- The routine (`juminTime.routine`) lists stretches of the day in KST as `{ from, to, state }`. A
  stretch whose `to` comes before its `from` runs past midnight and belongs to the day it starts
  on. Where two stretches overlap, the one that started last wins. The card shows only the current
  state, always after "maybe…" (or the same word in the page language), never the routine itself.
- After changing the name, tagline, affiliation or photo, run `npm run icons` so the link-preview
  image matches.
- After any content change, run `npm run github-profile` and push the profile repository, so the
  GitHub profile says the same thing as the site.

## Design

The rules live in [docs/DESIGN.md](docs/DESIGN.md) (in Korean), and every colour, size, radius and
timing lives in `src/styles/tokens.css`. Use a token, or add one, instead of hard-coding a value.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which lints, builds and publishes the
site to GitHub Pages. In the repository settings, Settings → Pages → Build and deployment → Source
must be set to GitHub Actions. `main` is the only branch.

## GitHub profile README

The README on github.com/jumincho lives in the jumincho/jumincho repository, and this repository
generates it. Clone that repository next to this one, then:

```bash
npm run github-profile                  # writes into ../jumincho
npm run github-profile -- path/to/repo  # or into another checkout
```

Commit and push in the profile repository afterwards. Never edit its READMEs or images by hand.

- There is one README per language: `README.md` in English, which the profile page shows, and
  `README.<code>.md` for the others. A row of language pills at the top links them together.
- Every image is a card laid out in Chromium with the site's tokens, tones, fonts, flags and
  mascot (`scripts/github-profile/cards.css`), then exported to SVG in a light and a dark
  version. The README picks one with `<picture>`, following the viewer's GitHub theme.
- Text is turned into outlines with HarfBuzz, so the images need no fonts and look the same in
  every browser. Chinese, Japanese and Korean body text uses Noto Sans, installed as a development
  dependency; each character is drawn by the first font in the stack that has it, as a browser
  would.
- On wide screens the cards sit two to a row at equal heights; on phones they stack.
- The hero, At a glance and footer cards move slowly (the name flips to "JUMIN WHO?" in a
  9-second cycle, blobs drift, Mongle bobs) and stand still when the viewer prefers reduced motion.
- The generator also writes `scripts/update-age.mjs` and `.github/workflows/age.yml` into the
  profile repository. The workflow redraws the age in every language's At a glance card every day
  at 00:05 KST, with no dependencies.
