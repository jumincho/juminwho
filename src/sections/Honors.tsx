import { BadgeCheck, Trophy } from 'lucide-react'
import Panel from '../components/Panel'
import { certifications, honors, labels } from '../data/profile'
import { panelProps } from './looks'
import styles from './Honors.module.css'

const stickers = [
  ...honors.map(({ title, org }) => ({ title, caption: org, Icon: Trophy })),
  ...certifications.map((title) => ({ title, caption: labels.certification, Icon: BadgeCheck })),
]

/** Awards and certifications as little stickers. */
export default function Honors() {
  return (
    <Panel {...panelProps('honors')}>
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
