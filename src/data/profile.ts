/**
 * Single source of truth for the page.
 * Every fact here comes from the LinkedIn profile (exported 2026-09) or from the
 * cited publication records. Nothing is invented; update this file, not the JSX.
 */

export interface Entry {
  period: string
  title: string
  org: string
  note?: string
}

export interface Publication {
  title: string
  authors: string[]
  venue: string
  year: number
  kind: string
  url?: string
}

export const profile = {
  name: 'JUMIN CHO',
  nameKo: '조주민',
  alias: 'JUMIN WHO?',
  tagline: 'A Dreamer of an Artificial Intelligence Expert',
  role: 'AI Researcher · Ph.D. Student',
  department: 'Computer Science',
  affiliation: 'Jeonbuk National University',
  lab: 'Natural Language Learning Lab',
  labShort: 'NLL Lab',
  advisor: 'Prof. Hyun-Je Song',
  location: 'Jeonju, Republic of Korea',
  birth: '1998-07-10T00:00:00+09:00',
  email: 'properly59@gmail.com',
  links: {
    email: 'mailto:properly59@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jumin-cho-42b126338/',
    github: 'https://github.com/jumincho',
    lab: 'https://sites.google.com/view/nlllab/main',
  },
} as const

export const about = [
  'I am a Ph.D. student in Computer Science at Jeonbuk National University, working in the Natural Language Learning Lab under Prof. Hyun-Je Song. I completed my M.S. in the same department under Prof. Seung-Hoon Na, now at UNIST.',
  'My research centres on retrieval-augmented generation and the reasoning behaviour of large language models: how a model should decide what to retrieve next in multi-hop question answering, and how retrieval and structured reasoning can make domain reports, such as radiology reports, more faithful to their evidence.',
]

export const interests = [
  'Retrieval-augmented generation',
  'Multi-hop question answering',
  'Reasoning in large language models',
  'Retrieval and structured reasoning for medical report generation',
]

export const experience: Entry[] = [
  {
    period: '2026.03 – present',
    title: 'Researcher',
    org: 'Jeonbuk National University',
    note: 'Advisor: Prof. Hyun-Je Song',
  },
  {
    period: '2024.03 – 2026.02',
    title: 'Researcher',
    org: 'Jeonbuk National University',
    note: 'Advisor: Prof. Seung-Hoon Na (now at UNIST)',
  },
  {
    period: '2025.03 – 2025.08',
    title: 'Teaching Assistant',
    org: 'Jeonbuk National University',
  },
  {
    period: '2024.03 – 2024.08',
    title: 'Research Assistant',
    org: 'Jeonbuk National University',
  },
  {
    period: '2020.12 – 2021.11',
    title: 'Vice Student Council President',
    org: 'Department of Computer Science, Jeonbuk National University',
  },
  {
    period: '2019.04 – 2021.02',
    title: 'Air Defense Artillery Sergeant (Patriot System) & Squad Leader',
    org: 'Republic of Korea Air Force',
  },
]

export const education: Entry[] = [
  {
    period: '2026.03 – 2029.02 (expected)',
    title: 'Ph.D. Student, Computer Science',
    org: 'Jeonbuk National University',
  },
  {
    period: '2024.03 – 2026.02',
    title: 'M.S., Computer Science',
    org: 'Jeonbuk National University',
  },
  {
    period: '2018.03 – 2024.02',
    title: 'B.S., Computer Science',
    org: 'Jeonbuk National University',
  },
]

export const publications: Publication[] = [
  {
    title: 'Forward-Looking Guidance for Iterative RAG in Multi-Hop Question Answering',
    authors: ['Jumin Cho', 'Chanjun Park', 'Seung-Hoon Na', 'Hyun-Je Song'],
    venue: 'CIKM 2026',
    year: 2026,
    kind: 'Short paper',
  },
  {
    title:
      'Optimizing Causality-Based Radiology Reporting with Retrieval-Augmented and Structured Reasoning Approaches for the NTCIR-18 HIDDEN-RAD Task',
    authors: ['Ju-Min Cho', 'Ho-Jin Yi', 'Myung-Kyu Kim', 'Se-Jin Jeong', 'Seung-Hoon Na'],
    venue: 'NTCIR-18',
    year: 2025,
    kind: 'Task participant paper',
    url: 'https://research.nii.ac.jp/ntcir/pdf/ntcir/04-NTCIR18-HIDDEN-RAD-ChoJ.pdf',
  },
]

/** Names that should be emphasised in author lists. */
export const selfNames = ['Jumin Cho', 'Ju-Min Cho']

export const honors: Entry[] = [
  { period: '', title: 'Excellence Award', org: 'AI-JBNU Program' },
  { period: '', title: '2nd Runner-up', org: 'Department of Computer Science Project Competition' },
]

export const certifications = ['Unmanned Multi-Copter Pilot License (Class 2)']

export const languages = [
  { name: 'Korean', level: 'Native' },
  { name: 'English', level: 'Limited working proficiency' },
]

export const lastUpdated = '2026-09'
