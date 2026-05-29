import styles from './Marquee.module.css'

const ROW_A = ['AI RESEARCHER', 'RETRIEVAL-AUGMENTED', 'STRUCTURED REASONING', 'CAUSALITY', 'RADIOLOGY NLP']
const ROW_B = ['A DREAMER', 'NTCIR-18 · HIDDEN-RAD', 'PhD @ JBNU', 'NATURAL LANGUAGE', 'JEONJU, KR']

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
