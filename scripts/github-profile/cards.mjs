/**
 * HTML for every image of the GitHub profile README, one `[data-frame]`
 * element per image. github-profile.mjs lays the page out in Chromium and
 * exports each frame to SVG, so the markup sticks to what
 * lib/export-scene.mjs understands (see cards.css).
 */
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  Cloud,
  FlaskConical,
  GraduationCap,
  Hand,
  Heart,
  Landmark,
  MapPin,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const icon = (Icon, props = {}) => renderToStaticMarkup(createElement(Icon, props))

/** Same years-since-birth arithmetic as the site's LiveAge, to four places. */
export function ageToday(birth) {
  return ((Date.now() - new Date(birth).getTime()) / (365.2425 * 24 * 60 * 60 * 1000)).toFixed(4)
}

/** The site in `lang`, optionally at a section: `?lang=` for every language but English. */
export function siteLink(site, lang, hash = '') {
  return `${site.url}${lang === 'en' ? '' : `?lang=${lang}`}${hash}`
}

/**
 * @param c        everything exported by src/data/profile.ts
 * @param lang     the language to write the cards in
 * @param assets   { Flag, LinkedInIcon, mascot (SVG markup), photo (data URI) }
 * @returns        { html, frames, age } where frames lists each image with its alt text and link
 */
export function buildCards(c, lang, { Flag, LinkedInIcon, mascot, photo }) {
  const { profile, labels, site, sections, githubProfile: gp } = c
  const t = (value) => value[lang]
  const mascotIcon = mascot.replace('<svg', '<svg class="mascot-icon"')
  const flag = (code) => `<span class="flag">${renderToStaticMarkup(createElement(Flag, { code }))}<span class="flag-ring"></span></span>`
  const placeText = (p) => t(labels.place)(t(p.city), t(p.country))
  const place = (p) => `<span class="place">${flag(p.countryCode)}${esc(placeText(p))}</span>`
  const head = (iconMarkup, title) =>
    `<div class="head"><span class="badge">${iconMarkup}</span><h2 class="title">${esc(title)}</h2></div>`
  const panel = (tone, inner) => `<section class="panel" data-tone="${tone}" data-shadow="md"><span class="corner"></span>${inner}</section>`
  const link = (hash = '') => siteLink(site, lang, hash)
  const frames = []
  const frame = (id, kind, inner, { alt, href, animated = false }) => {
    frames.push({ id, alt, href, animated })
    return `<div class="frame ${kind}" data-frame="${id}">${inner}</div>`
  }
  const university = t(profile.university.label)

  // ---- hero ----
  const hero = frame(
    'hero',
    'wide',
    `<div class="hero" data-shadow="md">
      <span class="hero-blob a" data-radial data-anim="drift-a"></span>
      <span class="hero-blob b" data-radial data-anim="drift-b"></span>
      <span class="hero-blob c" data-radial data-anim="drift-c"></span>
      <span class="hero-blob d" data-radial data-anim="drift-d"></span>
      <div class="hero-text">
        <p class="greeting"><span class="wave" data-anim="wave">${icon(Hand)}</span>${esc(t(labels.greeting))}</p>
        <div class="name-box">
          <p class="name" data-anim="flip-a">${esc(profile.name)}</p>
          <p class="name alias" data-anim="flip-b">${esc(profile.alias)}</p>
        </div>
        <p class="ko" lang="ko"><span class="ko-mark"></span>${esc(profile.nameKo)}</p>
        <p class="tagline">${esc(t(profile.tagline))}</p>
        <p class="role">${esc(`${t(profile.role)} · ${university}`)}</p>
      </div>
      <div class="portrait">
        <span class="halo" data-anim="spin"></span>
        <img class="photo" src="${photo}" alt="" data-shadow="lg" />
        <span class="cloud" data-anim="drift">${icon(Cloud, { fill: 'currentColor', strokeWidth: 0 })}</span>
        <span class="sparkle" data-anim="twinkle">${icon(Sparkles, { fill: 'currentColor', strokeWidth: 1.5 })}</span>
        <span class="hero-mascot" data-anim="bob">${mascot}</span>
      </div>
    </div>`,
    {
      alt: `${profile.name} (${profile.nameKo}): ${t(profile.tagline)}. ${t(profile.role)}, ${university}.`,
      href: link(),
      animated: true,
    },
  )

  // ---- pill buttons ----
  const button = (id, tone, iconMarkup, label, href) =>
    frame(
      id,
      'pill',
      `<span class="button" data-shadow="sm"><span class="button-icon" data-tone="${tone}">${iconMarkup}</span><span class="button-label">${esc(label)}</span><span class="button-arrow">${icon(ArrowUpRight)}</span></span>`,
      { alt: label, href },
    )
  const buttons = [
    button('button-portfolio', 'peach', mascotIcon, t(gp.portfolio), link()),
    button('button-linkedin', 'sky', renderToStaticMarkup(createElement(LinkedInIcon)), profile.linkedin.label, profile.linkedin.href),
    button('button-lab', 'sage', icon(FlaskConical), gp.lab, profile.lab.href),
  ].join('')

  // ---- at a glance ----
  const fact = (tone, iconMarkup, label, value) =>
    `<div class="fact" data-tone="${tone}"><span class="fact-icon">${iconMarkup}</span><div><p class="fact-label">${esc(label)}</p>${value}</div></div>`
  const age = ageToday(profile.birth)
  const department = t(profile.department.label)
  // Institution names wrap as a whole.
  const affiliation = t(labels.affiliationOrder)(esc(department), `<span class="nowrap">${esc(university)}</span>`).join('')
  const glance = frame(
    'glance',
    'card',
    panel(
      'lilac',
      `${head(mascotIcon, t(gp.glance))}
      <div class="facts">
        ${fact('lilac', icon(Sparkles), t(labels.role), `<p class="fact-value">${esc(t(profile.role))}</p>`)}
        ${fact('sky', icon(Landmark), t(labels.affiliation), `<p class="fact-value">${affiliation}</p><p class="fact-value">${esc(profile.lab.label)}</p>`)}
        ${fact('sage', icon(MapPin), t(labels.location), `<p class="fact-value">${place(profile.location)}</p>`)}
        ${fact('rose', icon(Heart), t(labels.age), `<p class="fact-value"><span class="age" data-age>${age}</span> <span class="age-unit">${esc(t(labels.ageUnit))}</span></p>`)}
      </div>
      <div class="glance-foot"><span class="bubble">${esc(profile.alias)}</span><span class="glance-mascot" data-anim="bob">${mascot}</span></div>`,
    ),
    {
      alt: `${t(gp.glance)}: ${t(profile.role)}; ${t(labels.affiliationOrder)(department, university).join('')}, ${profile.lab.label}; ${placeText(profile.location)}.`,
      href: link(),
      animated: true,
    },
  )

  // ---- publications: titles, authors and venues stay as published ----
  const venue = ({ venue: v, year }) => (v.includes(String(year)) ? v : `${v} · ${year}`)
  const authors = (names) =>
    names.map((n) => (c.selfNames.includes(n) ? `<span class="self"><span class="self-mark"></span>${esc(n)}</span>` : esc(n))).join(', ')
  const papers = c.publications
    .map(
      (p) => `<article class="paper" data-shadow="sm">
        <div class="paper-meta"><span class="chip">${esc(venue(p))}</span>${p.place ? place(p.place) : ''}</div>
        <h3 class="paper-title" lang="en">${esc(p.title)}</h3>
        <p class="authors" lang="en">${authors(p.authors)}</p>
      </article>`,
    )
    .join('')
  const publications = frame('publications', 'card', panel('sage', `${head(icon(BookOpen), t(sections.publications.title))}<div class="papers">${papers}</div>`), {
    alt: `${t(sections.publications.title)}: ${c.publications.map((p) => `${p.title} (${venue(p)}${p.place ? `, ${placeText(p.place)}` : ''})`).join('; ')}.`,
    href: link(`#${sections.publications.id}`),
  })

  // ---- timelines ----
  const periodLabel = ({ from, to, expected }) => {
    const range = `<span class="range">${esc(`${from} – ${to ?? t(labels.present)}`)}</span>`
    return expected ? `${range}<span class="expected">${esc(t(labels.expected))}</span>` : range
  }
  const timeline = (entries) =>
    `<ol class="timeline">${entries
      .map((e, i) => {
        const ongoing = !e.period.to || e.period.expected
        return `<li class="entry${ongoing ? ' ongoing' : ''}">
          ${i < entries.length - 1 ? '<span class="thread" data-vline></span>' : ''}
          ${ongoing ? '<span class="glow"></span>' : ''}<span class="dot"></span>
          <p class="period">${periodLabel(e.period)}</p>
          <h3 class="entry-title">${esc(t(e.title))}</h3>
          <p class="entry-org">${esc(t(e.org))}</p>
          ${e.advisor ? `<p class="entry-note">${esc(t(labels.advisor))} · <span class="who">${esc(t(e.advisor.label))}</span></p>` : ''}
        </li>`
      })
      .join('')}</ol>`
  const listAlt = (title, entries) => `${title}: ${entries.map((e) => `${t(e.title)}, ${t(e.org)}`).join('; ')}.`

  const experience = frame('experience', 'card', panel('peach', `${head(icon(Briefcase), t(sections.experience.title))}${timeline(c.experience)}`), {
    alt: listAlt(t(sections.experience.title), c.experience),
    href: link(`#${sections.experience.id}`),
  })

  const stickers = [
    ...c.honors.map((h) => ({ title: t(h.title), caption: t(h.org), glyph: Trophy })),
    ...c.certifications.map((title) => ({ title: t(title), caption: t(labels.certification), glyph: BadgeCheck })),
  ]
    .map(
      (s) =>
        `<div class="sticker" data-shadow="sm"><span class="sticker-icon">${icon(s.glyph)}</span><div><p class="sticker-title">${esc(s.title)}</p><p class="sticker-caption">${esc(s.caption)}</p></div></div>`,
    )
    .join('')
  const education = frame(
    'education',
    'card',
    `<div class="stack">
      ${panel('sky', `${head(icon(GraduationCap), t(sections.education.title))}${timeline(c.education)}`)}
      ${panel('butter', `${head(icon(Award), t(sections.honors.title))}<div class="stickers">${stickers}</div>`)}
    </div>`,
    {
      alt: `${listAlt(t(sections.education.title), c.education)} ${t(sections.honors.title)}: ${[...c.honors.map((h) => t(h.title)), ...c.certifications.map(t)].join('; ')}.`,
      href: link(`#${sections.education.id}`),
    },
  )

  // ---- footer ----
  const footer = frame(
    'footer',
    'wide',
    `<div class="foot">
      <div class="bumps">${'<span class="bump"></span>'.repeat(16)}</div>
      <div class="foot-body">
        <p class="thanks">${esc(t(labels.thanks))}</p>
        <p class="wish">${esc(t(labels.signOff))}</p>
        <p class="foot-meta">${esc(`© ${new Date().getFullYear()} ${profile.name} · ${t(labels.lastUpdated)} ${site.lastUpdated}`)}</p>
      </div>
      <span class="foot-mascot" data-anim="bob">${mascot}</span>
    </div>`,
    { alt: `${t(labels.thanks)} ${t(labels.signOff)}`, href: link(), animated: true },
  )

  const html = [hero, `<div class="row">${buttons}</div>`, glance, publications, experience, education, footer].join('\n')
  return { html, frames, age }
}

/**
 * The language row at the top of every README: one small pill per language,
 * `lang-<code>` plain and `lang-<code>-on` tinted and checked for the README
 * it sits in. The same images serve every README.
 */
export function buildLanguagePills(c) {
  const frames = []
  const html = c.languages
    .flatMap((language) =>
      [false, true].map((on) => {
        const id = `lang-${language.code}${on ? '-on' : ''}`
        frames.push({ id, code: language.code, on, alt: on ? `${language.name} ✓` : language.name })
        return `<div class="frame pill" data-frame="${id}"><span class="lang-pill${on ? ' on' : ''}" data-tone="lilac" data-shadow="sm"><span class="lang-region">${esc(language.region)}</span><span class="lang-name" lang="${language.code}">${esc(language.name)}</span>${on ? `<span class="lang-check">${icon(Check, { strokeWidth: 3 })}</span>` : ''}</span></div>`
      }),
    )
    .join('\n')
  return { html: `<div class="row">${html}</div>`, frames }
}

/** Pairs shown side by side on wide screens; the shorter one grows to match. */
export const rows = [
  ['glance', 'publications'],
  ['experience', 'education'],
]
