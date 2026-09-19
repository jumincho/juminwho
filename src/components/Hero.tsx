import { profile } from '../data/profile'
import { useScrolled } from '../lib/useScrolled'
import LiveAge from './LiveAge'
import styles from './Hero.module.css'

/** Scroll distance (px) after which the name reads "JUMIN WHO?". */
export const ALIAS_SCROLL_THRESHOLD = 48

export default function Hero() {
  const alias = useScrolled(ALIAS_SCROLL_THRESHOLD)
  const photo = `${import.meta.env.BASE_URL}jumin-cho.jpg`

  return (
    <section className={`wrap ${styles.hero}`} id="top" aria-labelledby="hero-name">
      <div className={styles.text}>
        <h1 id="hero-name" className={`${styles.name} ${alias ? styles.nameAlias : ''}`} aria-label={profile.name}>
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
              <a href={profile.links.department} className="link" target="_blank" rel="noopener noreferrer">
                {profile.department}
              </a>
              ,{' '}
              <a href={profile.links.university} className="link" target="_blank" rel="noopener noreferrer">
                {profile.affiliation}
              </a>
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
