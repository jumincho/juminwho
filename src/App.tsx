import SiteHeader from './components/SiteHeader'
import Hero from './components/Hero'
import Section from './components/Section'
import EntryList from './components/EntryList'
import PublicationList from './components/PublicationList'
import SiteFooter from './components/SiteFooter'
import {
  about,
  certifications,
  education,
  experience,
  honors,
  languages,
  profile,
  publications,
} from './data/profile'
import styles from './App.module.css'

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        <Section id="about" title="About">
          <div className={styles.prose}>
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h3 className={styles.subheading}>Languages</h3>
          <dl className={styles.kv}>
            {languages.map((lang) => (
              <div key={lang.name} className={styles.kvRow}>
                <dt>{lang.name}</dt>
                <dd>{lang.level}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="experience" title="Experience">
          <EntryList items={experience} label="Experience" />
        </Section>

        <Section id="education" title="Education">
          <EntryList items={education} label="Education" />
        </Section>

        <Section id="publications" title="Publications">
          <PublicationList items={publications} />
        </Section>

        <Section id="honors" title="Honors & certifications">
          <EntryList items={honors} label="Honors and awards" />
          <h3 className={styles.subheading}>Certifications</h3>
          <ul className={styles.plainList}>
            {certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section id="contact" title="Contact">
          <p className={styles.lead}>
            The quickest way to reach me is email. I read every message and reply to anything about research,
            collaboration, or the site itself.
          </p>
          <dl className={styles.kv}>
            <div className={styles.kvRow}>
              <dt>Email</dt>
              <dd>
                <a href={profile.links.email} className="link">
                  {profile.email}
                </a>
              </dd>
            </div>
            <div className={styles.kvRow}>
              <dt>LinkedIn</dt>
              <dd>
                <a href={profile.links.linkedin} className="link" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/jumin-cho-42b126338
                </a>
              </dd>
            </div>
            <div className={styles.kvRow}>
              <dt>GitHub</dt>
              <dd>
                <a href={profile.links.github} className="link" target="_blank" rel="noopener noreferrer">
                  github.com/jumincho
                </a>
              </dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Lab</dt>
              <dd>
                <a href={profile.links.lab} className="link" target="_blank" rel="noopener noreferrer">
                  {profile.lab}, {profile.affiliation}
                </a>
              </dd>
            </div>
          </dl>
        </Section>
      </main>
      <SiteFooter />
    </>
  )
}
