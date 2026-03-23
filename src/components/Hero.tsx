import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

export default function Hero() {
  const [showAlias, setShowAlias] = useState(false)
  const profileImage = `${import.meta.env.BASE_URL}jumin-cho.jpg`

  return (
    <section className={styles.hero} id="about">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.text}>
            <div className={styles.nameWrap}>
              <span className={styles.nameHint}>Hover or tap the name</span>
              <h1
                className={`${styles.greeting} ${showAlias ? styles.greetingActive : ''}`}
                tabIndex={0}
                onMouseEnter={() => setShowAlias(true)}
                onMouseLeave={() => setShowAlias(false)}
                onFocus={() => setShowAlias(true)}
                onBlur={() => setShowAlias(false)}
                onTouchStart={() => setShowAlias((current) => !current)}
              >
                <span className={`${styles.nameFace} ${styles.namePrimary}`}>JUMIN CHO</span>
                <span className={`${styles.nameFace} ${styles.nameAlias}`}>JUMIN WHO?</span>
              </h1>
            </div>
            <p className={styles.role}>A Dreamer of an Artificial Intelligence Expert</p>
            <p className={styles.affiliation}>
              Affiliation, lab, and short introduction will be updated later.
            </p>
            <div className={styles.interests}>
              <h3>Focus Areas</h3>
              <ul>
                <li>Primary research topic to be added later</li>
                <li>Secondary interest and long-term direction to be added later</li>
                <li>Representative keywords and collaboration topics to be added later</li>
              </ul>
            </div>
            <div className={styles.skills}>
              <h3>Tech Stack</h3>
              <div className={styles.skillTags}>
                <span>Stack TBD</span>
                <span>Tooling TBD</span>
                <span>Infra TBD</span>
                <span>Libraries TBD</span>
              </div>
            </div>
            <div className={styles.linksGroup}>
              <div className={styles.links}>
                <span className={styles.linksLabel}>About Me</span>
                <Link to="/cv" className={styles.cvLink}>CV</Link>
                <span className={styles.divider}>|</span>
                <Link to="/projects" className={styles.cvLink}>Projects</Link>
                <span className={styles.divider}>|</span>
                <Link to="/blog" className={styles.cvLink}>Blog</Link>
              </div>
              <div className={styles.links}>
                <span className={styles.linksLabel}>Contact Me</span>
                <a href="https://github.com/jumincho" className={styles.link} target="_blank" rel="noopener noreferrer">GitHub</a>
                <span className={styles.divider}>|</span>
                <span className={styles.link}>More links later</span>
              </div>
            </div>
          </div>
          <div className={styles.photo}>
            <img src={profileImage} alt="JUMIN CHO" className={styles.profileImg} />
          </div>
        </div>
      </div>
    </section>
  )
}
