import styles from './Marquee.module.css'

const ROW_A = ['JUMIN CHO', 'AI RESEARCHER', 'PhD STUDENT', 'COMPUTER SCIENCE']
const ROW_B = ['조주민', 'A DREAMER', 'JEONBUK NATIONAL UNIVERSITY', 'JEONJU · KR']

function Row({ words, reverse }: { words: string[]; reverse?: boolean }) {
  const content = (
    <div className={styles.group} aria-hidden>
      {words.map((w) => (
        <span key={w} className={styles.item}>
          {w}
          <span className={styles.star}>✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`${styles.row} ${reverse ? styles.reverse : ''}`}>
      {content}
      {content}
    </div>
  )
}

export default function Marquee() {
  return (
    <section className={styles.section} aria-label="Keywords">
      <Row words={ROW_A} />
      <Row words={ROW_B} reverse />
    </section>
  )
}
