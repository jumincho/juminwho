import SiteHeader from './components/SiteHeader'
import Hero from './components/Hero'
import Section from './components/Section'
import EntryList from './components/EntryList'
import PublicationList from './components/PublicationList'
import SiteFooter from './components/SiteFooter'
import { certifications, education, experience, honors, publications } from './data/profile'
import styles from './App.module.css'

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

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
      </main>
      <SiteFooter />
    </>
  )
}
