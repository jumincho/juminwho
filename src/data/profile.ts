/**
 * Single source of truth for the landing page.
 * Every value here is taken directly from the LinkedIn profile — nothing invented.
 */

export interface TimelineEntry {
  role: string
  org: string
  period: string
  note?: string
}

export const profile = {
  name: 'JUMIN CHO',
  nameKo: '조주민',
  alias: 'JUMIN WHO?',
  tagline: 'A Dreamer of an Artificial Intelligence Expert',
  role: 'AI Researcher',
  roleLong: 'AI Researcher · Ph.D. Student',
  affiliation: 'Jeonbuk National University',
  lab: 'NLL Lab',
  locationShort: 'Jeonju, South Korea',
  locationLong: 'Jeonju, Jeollabuk-do, Republic of Korea',
  coords: '35.82°N 127.10°E',
  language: 'Korean — Native / Bilingual',
  certification: 'Unmanned Multi-Copter Pilot License (Class 2)',
  links: {
    email: 'properly59@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jumin-cho-42b126338',
    lab: 'https://sites.google.com/view/nlllab/main',
    portfolio: 'https://jumincho.github.io/juminwho/',
    github: 'https://github.com/jumincho',
  },
} as const

/** Statement built strictly from stated role + affiliation + the publication topic. */
export const manifesto =
  'AI Researcher and Ph.D. student at Jeonbuk National University, working on retrieval-augmented, causality-based structured reasoning for radiology report generation.'

/** Research keywords — all drawn from the publication title and field. */
export const focus = [
  'Natural Language Processing',
  'Retrieval-Augmented Generation',
  'Structured Reasoning',
  'Causality-Based Reasoning',
  'Radiology Report Generation',
  'NTCIR-18 · HIDDEN-RAD',
]

export const publication = {
  title:
    'Optimizing Causality-Based Radiology Reporting with Retrieval-Augmented and Structured Reasoning Approaches for the NTCIR-18 HIDDEN-RAD Task',
  venue: 'NTCIR-18 · HIDDEN-RAD Task',
}

/** Four-stage pipeline distilled from the publication title. */
export const pipeline = [
  { label: 'Radiology Findings', sub: 'clinical input', icon: '🩻' },
  { label: 'Retrieval-Augmented Context', sub: 'evidence grounding', icon: '🔎' },
  { label: 'Causality-Based Structured Reasoning', sub: 'inference core', icon: '🧩' },
  { label: 'Faithful Radiology Report', sub: 'generated output', icon: '📄' },
]

export const education: TimelineEntry[] = [
  { role: 'Ph.D. in Computer Science', org: 'Jeonbuk National University', period: '2026.03 – 2029.02', note: 'Candidate' },
  { role: 'M.S. in Computer Science', org: 'Jeonbuk National University', period: '2024.03 – 2026.02' },
  { role: 'B.S. in Computer Science', org: 'Jeonbuk National University', period: '2018.03 – 2024.02' },
]

export const experience: TimelineEntry[] = [
  { role: 'Researcher', org: 'Jeonbuk National University', period: '2026.03 – Present', note: 'Advisor: Prof. Hyun-Je Song' },
  { role: 'Researcher', org: 'Jeonbuk National University', period: '2024.03 – 2026.02', note: 'Advisor: Prof. Seung-Hoon Na (now at UNIST)' },
  { role: 'Teaching Assistant', org: 'Jeonbuk National University', period: '2025.03 – 2025.08' },
  { role: 'Research Assistant', org: 'Jeonbuk National University', period: '2024.03 – 2024.08' },
  { role: 'Vice Student Council President', org: 'Dept. of Computer Science, JBNU', period: '2020.12 – 2021.11' },
  { role: 'Air Defense Artillery Sergeant (Patriot) & Squad Leader', org: 'Republic of Korea Air Force', period: '2019.04 – 2021.02' },
]

export const awards = [
  'Excellence Award · AI-JBNU Program',
  '2nd Runner-up · Dept. of Computer Science Project Competition',
]
