import { ArrowUpRight, Ticket } from 'lucide-react'
import ExternalLink from '../components/ExternalLink'
import Mascot from '../components/Mascot'
import { invites, labels, profile, site } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage'
import type { Tone } from '../lib/tone'
import styles from './Footer.module.css'

/** One tone per invite, in the order of `invites.links`. */
const inviteTones: Tone[] = ['meta', 'sage']

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <Mascot size={72} className={styles.mascot} />
        <p className={styles.signOff}>
          <span>{t(labels.thanks)}</span> <span>{t(labels.signOff)}</span>
        </p>
        <div className={styles.invites}>
          <p id="invites-title" className={styles.invitesTitle}>
            <Ticket aria-hidden="true" />
            {t(invites.title)}
          </p>
          <ul className={styles.inviteList} aria-labelledby="invites-title">
            {invites.links.map((invite, i) => (
              <li key={invite.href}>
                <ExternalLink href={invite.href} className={styles.invite} data-tone={inviteTones[i]}>
                  <span lang="en">{invite.label}</span>
                  {invite.code && (
                    <span className={styles.code}>
                      <span className="visually-hidden">{t(invites.codeLabel)} </span>
                      {invite.code}
                    </span>
                  )}
                  <ArrowUpRight className={styles.arrow} aria-hidden="true" />
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.meta}>
          © {new Date().getFullYear()} {profile.name} · {t(labels.lastUpdated)} {site.lastUpdated} ·{' '}
          <ExternalLink href={site.source} className="link">
            {t(labels.source)}
          </ExternalLink>
        </p>
      </div>
    </footer>
  )
}
