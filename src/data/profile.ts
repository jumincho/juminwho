/**
 * Every word on the page lives in this file; components only arrange it.
 *
 * Facts come from the LinkedIn profile (exported 2026-09) and the cited
 * publication records. Nothing is invented: when a fact changes, change it here.
 * `vite.config.ts` also reads `site` to fill the <head> tags, so keep this file
 * free of browser-only code.
 */
import type {
  Honor,
  Link,
  Place,
  Publication,
  Routine,
  RoutineState,
  SectionMeta,
  TimelineEntry,
} from './types'

export const site = {
  title: 'JUMIN WHO?',
  description:
    'Jumin Cho, AI researcher and Ph.D. student in Computer Science at Jeonbuk National University.',
  url: 'https://jumincho.github.io/juminwho/',
  source: 'https://github.com/jumincho/juminwho',
  lastUpdated: '2026-09',
}

export const profile = {
  name: 'JUMIN CHO',
  /** Shown on hover and once the page is scrolled. */
  alias: 'JUMIN WHO?',
  nameKo: '조주민',
  tagline: 'A Dreamer of an Artificial Intelligence Expert',
  role: 'AI Researcher · Ph.D. Student',
  location: { city: 'Jeonju', country: 'Republic of Korea', countryCode: 'KR' } satisfies Place,
  /** Birth instant (KST) for the live age counter. */
  birth: '1998-07-10T00:00:00+09:00',
  email: 'properly59@gmail.com',
  photo: {
    src: 'jumin-cho.jpg',
    alt: 'Jumin Cho standing under cherry blossoms by a pond',
  },
  // "index..do" with two dots is not a typo: it is the address JBNU's CMS gives this site's home page.
  department: { label: 'Computer Science', href: 'https://top.jbnu.ac.kr/csaieng/index..do' },
  university: { label: 'Jeonbuk National University', href: 'https://www.jbnu.ac.kr/en/index.do' },
  lab: { label: 'Natural Language Learning Lab', href: 'https://sites.google.com/view/nlllab/main' },
  linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jumin-cho-42b126338/' },
  github: { label: 'GitHub', href: 'https://github.com/jumincho' },
}

/** Page sections in reading order; the header navigation follows this order. */
export const sections = {
  publications: { id: 'publications', title: 'Publications', nav: 'Publications' },
  experience: { id: 'experience', title: 'Experience', nav: 'Experience' },
  education: { id: 'education', title: 'Education', nav: 'Education' },
  honors: { id: 'honors', title: 'Honors & certifications', nav: 'Honors' },
} satisfies Record<string, SectionMeta>

export type SectionKey = keyof typeof sections

const advisors = {
  song: { label: 'Prof. Hyun-Je Song', href: 'https://sites.google.com/site/songhyunje/Home' },
  na: { label: 'Prof. Seung-Hoon Na (now at UNIST)', href: 'https://nlp.unist.ac.kr/faculty.html' },
} satisfies Record<string, Link>

export const publications: Publication[] = [
  {
    title: 'Forward-Looking Guidance for Iterative RAG in Multi-Hop Question Answering',
    authors: ['Jumin Cho', 'Chanjun Park', 'Seung-Hoon Na', 'Hyun-Je Song'],
    venue: 'CIKM 2026',
    year: 2026,
    place: { city: 'Rome', country: 'Italy', countryCode: 'IT' },
  },
  {
    title:
      'Optimizing Causality-Based Radiology Reporting with Retrieval-Augmented and Structured Reasoning Approaches for the NTCIR-18 HIDDEN-RAD Task',
    authors: ['Ju-Min Cho', 'Ho-Jin Yi', 'Myung-Kyu Kim', 'Se-Jin Jeong', 'Seung-Hoon Na'],
    venue: 'NTCIR-18',
    year: 2025,
    place: { city: 'Tokyo', country: 'Japan', countryCode: 'JP' },
    href: 'https://research.nii.ac.jp/ntcir/workshop/OnlineProceedings18/pdf/ntcir/04-NTCIR18-HIDDEN-RAD-ChoJ.pdf',
  },
]

/** Spellings of Jumin's name that are emphasised in author lists. */
export const selfNames = ['Jumin Cho', 'Ju-Min Cho']

export const experience: TimelineEntry[] = [
  {
    period: { from: '2026.03' },
    title: 'Researcher',
    org: 'Jeonbuk National University',
    advisor: advisors.song,
  },
  {
    period: { from: '2024.03', to: '2026.02' },
    title: 'Researcher',
    org: 'Jeonbuk National University',
    advisor: advisors.na,
  },
  {
    period: { from: '2025.03', to: '2025.08' },
    title: 'Teaching Assistant',
    org: 'Jeonbuk National University',
  },
  {
    period: { from: '2024.03', to: '2024.08' },
    title: 'Research Assistant',
    org: 'Jeonbuk National University',
  },
  {
    period: { from: '2020.12', to: '2021.11' },
    title: 'Vice Student Council President',
    org: 'Department of Computer Science, Jeonbuk National University',
  },
  {
    period: { from: '2019.04', to: '2021.02' },
    title: 'Air Defense Artillery Sergeant (Patriot System) & Squad Leader',
    org: 'Republic of Korea Air Force',
  },
]

export const education: TimelineEntry[] = [
  {
    period: { from: '2026.03', to: '2029.02', expected: true },
    title: 'Ph.D. Student, Computer Science',
    org: 'Jeonbuk National University',
  },
  {
    period: { from: '2024.03', to: '2026.02' },
    title: 'M.S., Computer Science',
    org: 'Jeonbuk National University',
  },
  {
    period: { from: '2018.03', to: '2024.02' },
    title: 'B.S., Computer Science',
    org: 'Jeonbuk National University',
  },
]

export const honors: Honor[] = [
  { title: 'Excellence Award', org: 'AI-JBNU Program' },
  { title: '2nd Runner-up', org: 'Department of Computer Science Project Competition' },
]

export const certifications: string[] = ['Unmanned Multi-Copter Pilot License (Class 2)']

/**
 * "What time is it for Jumin?", the clock card under the hero: Jumin's time
 * or the visitor's, and what Jumin is maybe doing right now. The card works
 * the state out from `routine` but never shows the routine itself, and every
 * state is hedged with `maybe`.
 */
export const juminTime = {
  id: 'jumin-time',
  title: 'What time is it for Jumin?',
  timeZone: 'Asia/Seoul',
  zoneName: 'KST',
  routine: {
    weekday: [
      { from: '09:00', to: '21:00', state: 'working' },
      { from: '21:00', to: '01:00', state: 'superposition' },
      { from: '01:00', to: '08:00', state: 'asleep' },
      { from: '08:00', to: '09:00', state: 'ready' },
    ],
    weekend: [
      { from: '08:00', to: '01:00', state: 'superposition' },
      { from: '01:00', to: '08:00', state: 'asleep' },
    ],
  } satisfies Routine,
  maybe: 'maybe…',
  states: {
    asleep: { label: 'asleep', hint: 'Sweet dreams. Your message will be waiting in the morning.' },
    ready: { label: 'getting ready for work', hint: 'Morning routine: the workday is about to begin.' },
    working: { label: 'working', hint: 'Working hours in Korea, a good time to say hello.' },
    superposition: {
      label: 'in superposition',
      hint: 'Every possible state at once, until measured. An email counts as a measurement.',
    },
  } satisfies Record<RoutineState, { label: string; hint: string }>,
  modesLabel: 'Show the time in',
  modes: { local: 'Local', jumin: 'Jumin' },
  using: { local: 'Using your local time', jumin: 'Using Jumin’s time (KST)' },
  days: { weekday: 'Weekday', weekend: 'Weekend' },
}

/** Interface wording: labels, greetings and screen-reader text. */
export const labels = {
  skipToContent: 'Skip to content',
  greeting: 'Hello there, I’m',
  role: 'Role',
  affiliation: 'Affiliation',
  location: 'Location',
  age: 'Age',
  ageUnit: 'years',
  ageSpoken: (years: number) => `${years} years old`,
  advisor: 'Advisor',
  present: 'present',
  expected: 'expected',
  certification: 'Certification',
  copyEmail: 'Copy email address',
  copied: 'Copied!',
  copiedSpoken: 'Email address copied',
  themeToDark: 'Switch to dark theme',
  themeToLight: 'Switch to light theme',
  navigation: 'Sections',
  backToTop: 'Back to top',
  thanks: 'Thanks for stopping by.',
  signOff: 'May every day be a good day!',
  lastUpdated: 'Last updated',
  source: 'Source',
}

/** Wording used only by the GitHub profile README (scripts/github-profile.mjs). */
export const githubProfile = {
  glance: 'At a glance',
  portfolio: 'Portfolio',
  lab: 'NLL Lab',
}
