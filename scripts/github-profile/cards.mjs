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

function periodLabel({ from, to, expected }, labels) {
  const range = `<span class="range">${esc(`${from} – ${to ?? labels.present}`)}</span>`
  return expected ? `${range}<span class="expected">${esc(labels.expected)}</span>` : range
}

/**
 * @param c        everything exported by src/data/profile.ts
 * @param assets   { Flag, LinkedInIcon, mascot (SVG markup), photo (data URI) }
 * @returns        { html, frames } where frames lists each image with its alt text and link
 */
export function buildCards(c, { Flag, LinkedInIcon, mascot, photo }) {
  const { profile, labels, site, sections, githubProfile: gp } = c
  const mascotIcon = mascot.replace('<svg', '<svg class="mascot-icon"')
  const flag = (code) => `<span class="flag">${renderToStaticMarkup(createElement(Flag, { code }))}<span class="flag-ring"></span></span>`
  const place = (p) => `<span class="place">${flag(p.countryCode)}${esc(`${p.city}, ${p.country}`)}</span>`
  const head = (iconMarkup, title) =>
    `<div class="head"><span class="badge">${iconMarkup}</span><h2 class="title">${esc(title)}</h2></div>`
  const panel = (tone, inner) => `<section class="panel" data-tone="${tone}" data-shadow="md"><span class="corner"></span>${inner}</section>`
  const link = (hash = '') => `${site.url}${hash}`
  const frames = []
  const frame = (id, kind, inner, { alt, href, animated = false }) => {
    frames.push({ id, alt, href, animated })
    return `<div class="frame ${kind}" data-frame="${id}">${inner}</div>`
  }

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
        <p class="greeting"><span class="wave" data-anim="wave">${icon(Hand)}</span>${esc(labels.greeting)}</p>
        <div class="name-box">
          <p class="name" data-anim="flip-a">${esc(profile.name)}</p>
          <p class="name alias" data-anim="flip-b">${esc(profile.alias)}</p>
        </div>
        <p class="ko"><span class="ko-mark"></span>${esc(profile.nameKo)}</p>
        <p class="tagline">${esc(profile.tagline)}</p>
        <p class="role">${esc(`${profile.role} · ${profile.university.label}`)}</p>
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
      alt: `${profile.name} (${profile.nameKo}): ${profile.tagline}. ${profile.role}, ${profile.university.label}.`,
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
    button('button-portfolio', 'peach', mascotIcon, gp.portfolio, link()),
    button('button-linkedin', 'sky', renderToStaticMarkup(createElement(LinkedInIcon)), profile.linkedin.label, profile.linkedin.href),
    button('button-lab', 'sage', icon(FlaskConical), gp.lab, profile.lab.href),
  ].join('')

  // ---- at a glance ----
  const fact = (tone, iconMarkup, label, value) =>
    `<div class="fact" data-tone="${tone}"><span class="fact-icon">${iconMarkup}</span><div><p class="fact-label">${esc(label)}</p>${value}</div></div>`
  const age = ageToday(profile.birth)
  const glance = frame(
    'glance',
    'card',
    panel(
      'lilac',
      `${head(mascotIcon, gp.glance)}
      <div class="facts">
        ${fact('lilac', icon(Sparkles), labels.role, `<p class="fact-value">${esc(profile.role)}</p>`)}
        ${fact(
          'sky',
          icon(Landmark),
          labels.affiliation,
          `<p class="fact-value">${esc(`${profile.department.label},`)} <span class="nowrap">${esc(profile.university.label)}</span></p><p class="fact-value">${esc(profile.lab.label)}</p>`,
        )}
        ${fact('sage', icon(MapPin), labels.location, `<p class="fact-value">${place(profile.location)}</p>`)}
        ${fact('rose', icon(Heart), labels.age, `<p class="fact-value"><span class="age" data-age>${age}</span> <span class="age-unit">${esc(labels.ageUnit)}</span></p>`)}
      </div>
      <div class="glance-foot"><span class="bubble">${esc(profile.alias)}</span><span class="glance-mascot" data-anim="bob">${mascot}</span></div>`,
    ),
    {
      alt: `${gp.glance}: ${profile.role}; ${profile.department.label}, ${profile.university.label}, ${profile.lab.label}; ${profile.location.city}, ${profile.location.country}.`,
      href: link(),
      animated: true,
    },
  )

  // ---- publications ----
  const venue = ({ venue: v, year }) => (v.includes(String(year)) ? v : `${v} · ${year}`)
  const authors = (names) =>
    names.map((n) => (c.selfNames.includes(n) ? `<span class="self"><span class="self-mark"></span>${esc(n)}</span>` : esc(n))).join(', ')
  const papers = c.publications
    .map(
      (p) => `<article class="paper" data-shadow="sm">
        <div class="paper-meta"><span class="chip">${esc(venue(p))}</span>${p.place ? place(p.place) : ''}</div>
        <h3 class="paper-title">${esc(p.title)}</h3>
        <p class="authors">${authors(p.authors)}</p>
      </article>`,
    )
    .join('')
  const publications = frame('publications', 'card', panel('sage', `${head(icon(BookOpen), sections.publications.title)}<div class="papers">${papers}</div>`), {
    alt: `${sections.publications.title}: ${c.publications.map((p) => `${p.title} (${venue(p)}${p.place ? `, ${p.place.city}` : ''})`).join('; ')}.`,
    href: link(`#${sections.publications.id}`),
  })

  // ---- timelines ----
  const timeline = (entries) =>
    `<ol class="timeline">${entries
      .map((e, i) => {
        const ongoing = !e.period.to || e.period.expected
        return `<li class="entry${ongoing ? ' ongoing' : ''}">
          ${i < entries.length - 1 ? '<span class="thread" data-vline></span>' : ''}
          ${ongoing ? '<span class="glow"></span>' : ''}<span class="dot"></span>
          <p class="period">${periodLabel(e.period, labels)}</p>
          <h3 class="entry-title">${esc(e.title)}</h3>
          <p class="entry-org">${esc(e.org)}</p>
          ${e.advisor ? `<p class="entry-note">${esc(labels.advisor)} · <span class="who">${esc(e.advisor.label)}</span></p>` : ''}
        </li>`
      })
      .join('')}</ol>`
  const listAlt = (title, entries) => `${title}: ${entries.map((e) => `${e.title}, ${e.org}`).join('; ')}.`

  const experience = frame('experience', 'card', panel('peach', `${head(icon(Briefcase), sections.experience.title)}${timeline(c.experience)}`), {
    alt: listAlt(sections.experience.title, c.experience),
    href: link(`#${sections.experience.id}`),
  })

  const stickers = [
    ...c.honors.map((h) => ({ title: h.title, caption: h.org, glyph: Trophy })),
    ...c.certifications.map((title) => ({ title, caption: labels.certification, glyph: BadgeCheck })),
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
      ${panel('sky', `${head(icon(GraduationCap), sections.education.title)}${timeline(c.education)}`)}
      ${panel('butter', `${head(icon(Award), sections.honors.title)}<div class="stickers">${stickers}</div>`)}
    </div>`,
    {
      alt: `${listAlt(sections.education.title, c.education)} ${sections.honors.title}: ${[...c.honors.map((h) => h.title), ...c.certifications].join('; ')}.`,
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
        <p class="thanks">${esc(labels.thanks)}</p>
        <p class="wish">${esc(labels.signOff)}</p>
        <p class="foot-meta">${esc(`© ${new Date().getFullYear()} ${profile.name} · ${labels.lastUpdated} ${site.lastUpdated}`)}</p>
      </div>
      <span class="foot-mascot" data-anim="bob">${mascot}</span>
    </div>`,
    { alt: `${labels.thanks} ${labels.signOff}`, href: link(), animated: true },
  )

  const html = [hero, `<div class="row">${buttons}</div>`, glance, publications, experience, education, footer].join('\n')
  return { html, frames, age }
}

/** Pairs shown side by side on wide screens; the shorter one grows to match. */
export const rows = [
  ['glance', 'publications'],
  ['experience', 'education'],
]
