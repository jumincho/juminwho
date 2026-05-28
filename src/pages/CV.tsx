import { motion } from 'framer-motion'
import ScrambleText from '../components/effects/ScrambleText'
import styles from './CV.module.css'

interface Entry {
  org: string
  role: string
  period: string
  detail?: string
}

const EDUCATION: Entry[] = [
  {
    org: 'Jeonbuk National University (JBNU)',
    role: 'Ph.D, Computer Science',
    period: '2026.03 – 2029.02 (expected)',
    detail: 'Advisor: Prof. Hyun-Je Song · NLLLab.',
  },
  {
    org: 'Jeonbuk National University (JBNU)',
    role: 'M.S., Computer Science',
    period: '2024.03 – 2026.02',
    detail: 'Advisor: Prof. Seung-Hoon Na (now at UNIST).',
  },
  {
    org: 'Jeonbuk National University (JBNU)',
    role: 'B.S., Computer Science',
    period: '2018.03 – 2024.02',
  },
]

const EXPERIENCE: Entry[] = [
  {
    org: 'Jeonbuk National University · NLLLab',
    role: 'Researcher',
    period: '2026.03 – Present',
    detail: 'Advisor: Prof. Hyun-Je Song. Causality-aware reasoning and retrieval-augmented generation for clinical NLP.',
  },
  {
    org: 'Jeonbuk National University · NLLLab',
    role: 'Researcher',
    period: '2024.03 – 2026.02 (2 yrs)',
    detail: 'Advisor: Prof. Seung-Hoon Na. Lead author on the NTCIR-18 HIDDEN-RAD task submission on radiology reporting.',
  },
  {
    org: 'Jeonbuk National University',
    role: 'Teaching Assistant',
    period: '2025.03 – 2025.08 (6 mo)',
    detail: 'Mentored undergraduate students in CS coursework.',
  },
  {
    org: 'Jeonbuk National University',
    role: 'Research Assistant',
    period: '2024.03 – 2024.08 (6 mo)',
  },
  {
    org: 'JBNU Department of Computer Science',
    role: 'Vice Student Council President',
    period: '2020.12 – 2021.11 (1 yr)',
  },
  {
    org: 'Republic of Korea Air Force',
    role: 'Air Defense Artillery Sergeant (Patriot) · Squad Leader',
    period: '2019.04 – 2021.02 (1 yr 11 mo)',
    detail: 'Operated and led teams on the Patriot air defense system. Honorably discharged.',
  },
]

const PUBLICATIONS = [
  {
    title:
      'Optimizing Causality-Based Radiology Reporting with Retrieval-Augmented and Structured Reasoning Approaches for the NTCIR-18 HIDDEN-RAD Task',
    venue: 'NTCIR-18 HIDDEN-RAD',
    year: '2025',
  },
]

const AWARDS = [
  { title: 'Excellence Award', org: 'AI-JBNU Program' },
  { title: '2nd Runner-up', org: 'Department of Computer Science Project Competition' },
]

const CERTIFICATIONS = [
  { title: 'Unmanned Multi-Copter Pilot License (Class 2)', org: 'Korea Transportation Safety Authority' },
]

const SKILLS = {
  research: ['NLP', 'RAG', 'LLM Reasoning', 'Causality', 'Radiology Reporting', 'Evaluation'],
  engineering: ['Python', 'PyTorch', 'HuggingFace', 'TypeScript', 'React', 'Node.js', 'Docker', 'Linux'],
  writing: ['LaTeX', 'Markdown', 'Korean (Native)', 'English (Academic)'],
}

export default function CV() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerInner}>
            <div className={styles.headerLeft}>
              <span className={styles.tag}>CV · CURRICULUM VITAE</span>
              <h1 className={styles.name}>
                <ScrambleText text="JUMIN CHO" />
              </h1>
              <p className={styles.subname}>조주민 · A Dreamer of an AI Expert</p>
              <p className={styles.line}>
                <span>AI Researcher</span>
                <span className={styles.bullet}>·</span>
                <span>Ph.D Student @ Jeonbuk National University</span>
              </p>
              <p className={styles.line}>
                <span>NLLLab</span>
                <span className={styles.bullet}>·</span>
                <span>Computer Science</span>
                <span className={styles.bullet}>·</span>
                <span>Jeonju, Republic of Korea 🇰🇷</span>
              </p>
              <div className={styles.linkRow}>
                <a href="mailto:properly59@gmail.com" className={styles.headerLink}>properly59@gmail.com</a>
                <span className={styles.linkDot}>•</span>
                <a href="https://github.com/jumincho" target="_blank" rel="noopener noreferrer" className={styles.headerLink}>github.com/jumincho</a>
                <span className={styles.linkDot}>•</span>
                <a href="https://www.linkedin.com/in/jumincho-42b126338" target="_blank" rel="noopener noreferrer" className={styles.headerLink}>linkedin / jumincho</a>
                <span className={styles.linkDot}>•</span>
                <a href="https://sites.google.com/view/nlllab/main" target="_blank" rel="noopener noreferrer" className={styles.headerLink}>NLLLab</a>
              </div>
            </div>
            <div className={styles.headerRight} aria-hidden>
              <div className={styles.statBlock}>
                <span className={styles.statNum}>99</span>
                <span className={styles.statLabel}>OVR</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statNum}>PhD</span>
                <span className={styles.statLabel}>POS</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statNum}>JBNU</span>
                <span className={styles.statLabel}>CLUB</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statNum}>KR</span>
                <span className={styles.statLabel}>NAT</span>
              </div>
            </div>
          </div>
          <div className={styles.gradientBar} aria-hidden />
        </motion.header>

        <Section title="Research Interests" code="01">
          <p className={styles.body}>
            Reasoning and retrieval for large language models — with an emphasis on
            <strong> causality-aware generation</strong> in high-stakes domains such as
            <strong> radiology reporting</strong>. Long-term, I want language models that are not
            just fluent, but provably faithful to evidence and to the causal structure of the world.
          </p>
        </Section>

        <Section title="Education" code="02">
          <div className={styles.entries}>
            {EDUCATION.map((e, i) => (
              <EntryRow key={`edu-${i}`} entry={e} />
            ))}
          </div>
        </Section>

        <Section title="Experience" code="03">
          <div className={styles.entries}>
            {EXPERIENCE.map((e, i) => (
              <EntryRow key={`exp-${i}`} entry={e} />
            ))}
          </div>
        </Section>

        <Section title="Publications" code="04">
          <ol className={styles.pubList}>
            {PUBLICATIONS.map((p, i) => (
              <li key={`pub-${i}`} className={styles.pubItem}>
                <span className={styles.pubIdx}>[{String(i + 1).padStart(2, '0')}]</span>
                <span>
                  <strong>Cho, J.</strong>{' '}<em>{p.title}.</em>{' '}{p.venue}, {p.year}.
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Honors & Awards" code="05">
          <ul className={styles.bullets}>
            {AWARDS.map((a) => (
              <li key={a.title}>
                <span className={styles.bulletDot}>◆</span>
                <strong>{a.title}</strong> — {a.org}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Certifications" code="06">
          <ul className={styles.bullets}>
            {CERTIFICATIONS.map((c) => (
              <li key={c.title}>
                <span className={styles.bulletDot}>◆</span>
                <strong>{c.title}</strong> — {c.org}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Skills" code="07">
          <div className={styles.skillsGrid}>
            <SkillBlock title="Research" tint="#fbbf24" items={SKILLS.research} />
            <SkillBlock title="Engineering" tint="#ec4899" items={SKILLS.engineering} />
            <SkillBlock title="Communication" tint="#06b6d4" items={SKILLS.writing} />
          </div>
        </Section>

        <Section title="Military Service" code="08">
          <p className={styles.body}>
            <strong>Republic of Korea Air Force</strong>, Air Defense Artillery — Sergeant on the
            Patriot system, squad leader. 23 months of service, honorably discharged. Calm in
            a control room is its own kind of training.
          </p>
        </Section>
      </div>
    </main>
  )
}

function Section({ title, code, children }: { title: string; code: string; children: React.ReactNode }) {
  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.sectionHead}>
        <span className={styles.sectionCode}>{code}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.sectionLine} aria-hidden />
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </motion.section>
  )
}

function EntryRow({ entry }: { entry: Entry }) {
  return (
    <div className={styles.entry}>
      <div className={styles.entryHeader}>
        <strong className={styles.entryRole}>{entry.role}</strong>
        <span className={styles.entryPeriod}>{entry.period}</span>
      </div>
      <div className={styles.entryOrg}>{entry.org}</div>
      {entry.detail && <div className={styles.entryDetail}>{entry.detail}</div>}
    </div>
  )
}

function SkillBlock({ title, items, tint }: { title: string; items: string[]; tint: string }) {
  return (
    <div className={styles.skillBlock} style={{ ['--tint' as string]: tint } as React.CSSProperties}>
      <div className={styles.skillTitle}>{title}</div>
      <div className={styles.skillItems}>
        {items.map((item) => (
          <span key={item} className={styles.skillChip}>{item}</span>
        ))}
      </div>
    </div>
  )
}
