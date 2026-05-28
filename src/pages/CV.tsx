import styles from './CV.module.css'

export default function CV() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.name}>JUMIN CHO</h1>
          <div className={styles.info}>
            <p>Affiliation / Department</p>
            <p>Institution / Lab</p>
            <p>City, Country</p>
            <div className={styles.contactLinks}>
              <a href="https://github.com/jumincho" target="_blank" rel="noopener noreferrer">github.com/jumincho</a>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Research Interests</h2>
          <p className={styles.text}>
            A concise overview of your research interests will be added later.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.entry}>
            <div className={styles.entryHeader}>
              <strong>Degree / Program</strong>
              <span className={styles.date}>Period to be added</span>
            </div>
            <div className={styles.entryDetail}>
              <span>Institution and advisor information will be added later.</span>
            </div>
          </div>
          <div className={styles.entry}>
            <div className={styles.entryHeader}>
              <strong>Previous Degree / Background</strong>
              <span className={styles.date}>Period to be added</span>
            </div>
            <div className={styles.entryDetail}>
              <span>Additional academic background will be added later.</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Publications</h2>
          <ul className={styles.pubList}>
            <li>Representative papers and preprints will be added later.</li>
            <li>Conference, journal, and workshop records will be added later.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className={styles.entry}>
            <div className={styles.entryHeader}>
              <strong>Research / Industry Experience</strong>
              <span className={styles.date}>Period to be added</span>
            </div>
            <p className={styles.text}>
              Project scope, role, and outcomes will be added later.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <ul className={styles.skillList}>
            <li>Primary programming languages and frameworks will be added later.</li>
            <li>Research methods, tooling, and deployment experience will be added later.</li>
            <li>Languages, writing, and presentation strengths will be added later.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Awards</h2>
          <ul className={styles.skillList}>
            <li>Scholarships, awards, and recognitions will be added later.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
