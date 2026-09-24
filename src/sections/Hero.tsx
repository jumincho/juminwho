import { Cloud, Hand, Heart, Landmark, MapPin, Sparkles, type LucideIcon } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons'
import CopyEmail from '../components/CopyEmail'
import ExternalLink from '../components/ExternalLink'
import LiveAge from '../components/LiveAge'
import Mascot from '../components/Mascot'
import NameFlip from '../components/NameFlip'
import type { Tone } from '../components/Panel'
import PlaceName from '../components/PlaceName'
import { labels, profile } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage'
import { useScrolled } from '../hooks/useScrolled'
import { cx } from '../lib/cx'
import styles from './Hero.module.css'

interface FactProps {
  icon: LucideIcon
  tone: Tone
  label: string
  /** Gives the icon a heartbeat. */
  beating?: boolean
  children: ReactNode
}

function Fact({ icon: Icon, tone, label, beating = false, children }: FactProps) {
  return (
    <div className={styles.fact} data-tone={tone}>
      <dt className={styles.factLabel}>
        <span className={cx(styles.factIcon, beating && styles.beating)}>
          <Icon />
        </span>
        {label}
      </dt>
      <dd className={styles.factValue}>{children}</dd>
    </div>
  )
}

function Portrait() {
  const { t } = useLanguage()
  return (
    <figure className={styles.portrait}>
      <span className={styles.halo} aria-hidden="true" />
      <img
        className={styles.photo}
        src={`${import.meta.env.BASE_URL}${profile.photo.src}`}
        alt={t(profile.photo.alt)}
        width={400}
        height={400}
        fetchPriority="high"
      />
      <Cloud className={styles.cloud} fill="currentColor" strokeWidth={0} />
      <Sparkles className={styles.sparkle} fill="currentColor" strokeWidth={1.5} />
      <Mascot size={96} className={styles.mascot} />
    </figure>
  )
}

export default function Hero() {
  const { t } = useLanguage()
  const scrolled = useScrolled()
  const affiliation = t(labels.affiliationOrder)(
    <ExternalLink href={profile.department.href} className="link">
      {t(profile.department.label)}
    </ExternalLink>,
    <ExternalLink href={profile.university.href} className="link">
      {t(profile.university.label)}
    </ExternalLink>,
  )

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-name">
      <div className={styles.intro}>
        <p className={styles.greeting}>
          <Hand className={styles.wave} />
          {t(labels.greeting)}
        </p>
        <h1 id="hero-name" className={styles.name}>
          <NameFlip name={profile.name} alias={profile.alias} flipped={scrolled} />
        </h1>
        <p className={styles.nameKo} lang="ko">
          {profile.nameKo}
        </p>
        <p className={styles.tagline}>{t(profile.tagline)}</p>
      </div>

      <Portrait />

      <div className={styles.details}>
        <dl className={styles.facts}>
          <Fact icon={Sparkles} tone="lilac" label={t(labels.role)}>
            {t(profile.role)}
          </Fact>
          <Fact icon={Landmark} tone="sky" label={t(labels.affiliation)}>
            {affiliation.map((part, i) => (
              <Fragment key={i}>{part}</Fragment>
            ))}
            <br />
            <ExternalLink href={profile.lab.href} className="link" lang="en">
              {profile.lab.label}
            </ExternalLink>
          </Fact>
          <Fact icon={MapPin} tone="sage" label={t(labels.location)}>
            <PlaceName place={profile.location} />
          </Fact>
          <Fact icon={Heart} tone="rose" label={t(labels.age)} beating>
            <span className={styles.age}>
              <LiveAge birth={profile.birth} className={styles.ageDigits} />
              <span className={styles.ageUnit} aria-hidden="true">
                {t(labels.ageUnit)}
              </span>
            </span>
          </Fact>
        </dl>

        <div className={styles.contact}>
          <CopyEmail email={profile.email} />
          <ExternalLink href={profile.linkedin.href} className={styles.social} data-tone="sky">
            <span className={styles.socialIcon}>
              <LinkedInIcon />
            </span>
            {profile.linkedin.label}
          </ExternalLink>
          <ExternalLink href={profile.github.href} className={styles.social} data-tone="lilac">
            <span className={styles.socialIcon}>
              <GitHubIcon />
            </span>
            {profile.github.label}
          </ExternalLink>
        </div>
      </div>
    </section>
  )
}
