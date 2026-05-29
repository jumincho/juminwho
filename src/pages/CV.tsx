import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { profile, education, experience, awards, publication } from '../data/profile'
import type { TimelineEntry } from '../data/profile'
import styles from './CV.module.css'

function Section({ title, index, children }: { title: string; index: string; children: ReactNode }) {
  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIndex}>{index}</span>
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

function Entry({ item }: { item: TimelineEntry }) {
  return (
    <div className={styles.entry}>
      <div className={styles.entryHead}>
        <strong>{item.role}</strong>
        <span className={styles.date}>{item.period}</span>
      </div>
      <div className={styles.entryBody}>
        <span>{item.org}</span>
        {item.note && <span className={styles.note}>{item.note}</span>}
      </div>
    </div>
  )
}

export default function CV() {
  useEffect(() => {
    document.documentElement.classList.add('dark-page')
    return () => document.documentElement.classList.remove('dark-page')
  }, [])

  return (
    <main className={styles.main}>
      <div className={styles.aura} aria-hidden />
      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className={styles.eyebrow}>CURRICULUM VITAE</p>
          <h1 className={styles.name}>
            {profile.name}<span className={styles.nameKo}>{profile.nameKo}</span>
          </h1>
          <p className={styles.role}>{profile.roleLong} · {profile.affiliation} · {profile.lab}</p>
          <p className={styles.tagline}>{profile.tagline}</p>
          <div className={styles.contactLinks}>
            <a href={`mailto:${profile.links.email}`}>{profile.links.email}</a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={profile.links.lab} target="_blank" rel="noopener noreferrer">NLL Lab</a>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <p className={styles.location}>{profile.locationLong}</p>
        </motion.header>

        <Section title="Education" index="01">
          {education.map((e) => <Entry key={`${e.role}-${e.period}`} item={e} />)}
        </Section>

        <Section title="Experience & Service" index="02">
          {experience.map((e) => <Entry key={`${e.role}-${e.period}`} item={e} />)}
        </Section>

        <Section title="Publications" index="03">
          <div className={styles.pub}>
            <span className={styles.pubVenue}>{publication.venue}</span>
            <p className={styles.pubTitle}>{publication.title}</p>
          </div>
        </Section>

        <Section title="Awards & Honors" index="04">
          <ul className={styles.list}>
            {awards.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </Section>

        <Section title="Certifications" index="05">
          <ul className={styles.list}>
            <li>{profile.certification}</li>
          </ul>
        </Section>

        <Section title="Languages" index="06">
          <ul className={styles.list}>
            <li>{profile.language}</li>
          </ul>
        </Section>
      </div>
    </main>
  )
}
