import { BadgeCheck, Trophy } from 'lucide-react'
import Panel from '../components/Panel'
import { certifications, honors, labels } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage'
import { panelProps } from './looks'
import styles from './Honors.module.css'

/** Awards and certifications as little stickers. */
export default function Honors() {
  const { t } = useLanguage()
  const stickers = [
    ...honors.map(({ title, org }) => ({ title: t(title), caption: t(org), Icon: Trophy })),
    ...certifications.map((title) => ({ title: t(title), caption: t(labels.certification), Icon: BadgeCheck })),
  ]

  return (
    <Panel {...panelProps('honors', t)}>
      <ul className={styles.stickers}>
        {stickers.map(({ title, caption, Icon }) => (
          <li key={title} className={styles.sticker}>
            <span className={styles.icon} aria-hidden="true">
              <Icon />
            </span>
            <span>
              <span className={styles.title}>{title}</span>
              <span className={styles.caption}>{caption}</span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
