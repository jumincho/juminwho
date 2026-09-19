import { useState } from 'react'
import { profile } from '../data/profile'
import LiveAge from './LiveAge'
import styles from './Hero.module.css'

export default function Hero() {
  const [alias, setAlias] = useState(false)
  const photo = `${import.meta.env.BASE_URL}jumin-cho.jpg`

  return (
    <section className={`wrap ${styles.hero}`} id="top" aria-labelledby="hero-name">
      <div className={styles.text}>
        <p className={styles.hint} aria-hidden="true">
          Hover or tap the name
        </p>
        <h1
          id="hero-name"
          className={`${styles.name} ${alias ? styles.nameAlias : ''}`}
          tabIndex={0}
          aria-label={profile.name}
          onMouseEnter={() => setAlias(true)}
          onMouseLeave={() => setAlias(false)}
          onFocus={() => setAlias(true)}
          onBlur={() => setAlias(false)}
          onClick={() => setAlias((v) => !v)}
        >
          <span className={`${styles.face} ${styles.facePrimary}`} aria-hidden={alias}>
            {profile.name}
          </span>
          <span className={`${styles.face} ${styles.faceAlias}`} aria-hidden={!alias}>
            {profile.alias}
          </span>
        </h1>
        <p className={styles.nameKo}>{profile.nameKo}</p>

        <p className={styles.tagline}>{profile.tagline}</p>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>Role</dt>
            <dd>{profile.role}</dd>
          </div>
          <div className={styles.fact}>
            <dt>Affiliation</dt>
            <dd>
              {profile.department}, {profile.affiliation}
              <br />
              <a href={profile.links.lab} className="link" target="_blank" rel="noopener noreferrer">
                {profile.lab}
              </a>
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>Location</dt>
            <dd>{profile.location}</dd>
          </div>
          <div className={styles.fact}>
            <dt>Age</dt>
            <dd className={styles.age}>
              <LiveAge birth={profile.birth} className={styles.ageNum} />
              <span className={styles.ageUnit} aria-hidden="true">
                years
              </span>
              <span className={styles.ageNote} aria-hidden="true">
                since 1998-07-10
              </span>
            </dd>
          </div>
        </dl>

        <ul className={styles.links} aria-label="Profiles">
          <li>
            <a href={profile.links.email} className="link">
              Email
            </a>
          </li>
          <li>
            <a href={profile.links.linkedin} className="link" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={profile.links.github} className="link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>

      <figure className={styles.photoWrap}>
        <img
          src={photo}
          alt={`${profile.name} standing under cherry blossoms by a pond`}
          className={styles.photo}
          width={400}
          height={400}
          loading="eager"
          decoding="async"
        />
      </figure>
    </section>
  )
}
