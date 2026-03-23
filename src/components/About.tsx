import ScrollReveal from './ScrollReveal'
import styles from './About.module.css'

const skills = [
  'Primary stack',
  'Frameworks',
  'Research tooling',
  'Deployment',
  'Writing',
  'Collaboration',
]

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <span className={styles.badge}>About Me</span>
          <h2 className={styles.title}>Personal Introduction</h2>
          <p className={styles.subtitle}>
            This section is reserved for a short self-introduction.
          </p>
        </ScrollReveal>

        <div className={styles.content}>
          <ScrollReveal delay={0.1}>
            <div className={styles.bio}>
              <p>
                A brief biography, research direction, and working style will be added later.
              </p>
              <p>
                Use this area for an accessible overview of your interests, values, and current work.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className={styles.skillsBox}>
              <h3 className={styles.skillsTitle}>Tech Stack</h3>
              <div className={styles.skills}>
                {skills.map((skill) => (
                  <span key={skill} className={styles.skill}>{skill}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
