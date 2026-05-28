import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ResearchAreas.module.css'

interface Area {
  index: string
  tag: string
  title: string
  body: string
  keywords: string[]
  accent: string
}

const AREAS: Area[] = [
  {
    index: '01',
    tag: 'REASONING',
    title: 'Structured Reasoning for LLMs',
    body: 'Designing prompting and reranking pipelines that make language models defend their answers with explicit, verifiable reasoning chains — especially in long-form generation.',
    keywords: ['CoT', 'tree search', 'self-consistency', 'rerank'],
    accent: '#fbbf24',
  },
  {
    index: '02',
    tag: 'RAG',
    title: 'Retrieval-Augmented Generation',
    body: 'Grounding generation in evidence: optimizing retrievers, query rewriting, and citation-faithful decoders for knowledge-intensive tasks like medical reporting.',
    keywords: ['dense retrieval', 'rerank', 'citation', 'faithfulness'],
    accent: '#ec4899',
  },
  {
    index: '03',
    tag: 'CAUSALITY',
    title: 'Causality-Aware Generation',
    body: 'My current direction at NLLLab — building radiology and clinical NLP systems that reason about cause and effect, not just statistical co-occurrence. Featured in NTCIR-18 HIDDEN-RAD.',
    keywords: ['radiology', 'counterfactuals', 'structured output', 'NTCIR'],
    accent: '#8b5cf6',
  },
  {
    index: '04',
    tag: 'TRUST',
    title: 'Trustworthy & Honest AI',
    body: 'Calibration, hallucination control, and explainability — pushing language models to know what they know and admit what they do not.',
    keywords: ['calibration', 'hallucination', 'evaluation', 'alignment'],
    accent: '#06b6d4',
  },
]

export default function ResearchAreas() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState(0)

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>// research · what I work on</span>
          <h2 className={styles.title}>
            Four threads, one&nbsp;
            <span className={styles.italic}>obsession</span>:
          </h2>
          <p className={styles.lede}>
            Make machines that reason as honestly as they generate.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.list}>
            {AREAS.map((area, i) => (
              <motion.button
                key={area.index}
                type="button"
                className={`${styles.item} ${active === i ? styles.activeItem : ''}`}
                style={{ ['--tint' as string]: area.accent } as React.CSSProperties}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <span className={styles.itemIndex}>{area.index}</span>
                <span className={styles.itemTag}>{area.tag}</span>
                <span className={styles.itemTitle}>{area.title}</span>
                <span className={styles.itemArrow} aria-hidden>→</span>
              </motion.button>
            ))}
          </div>

          <motion.div
            key={active}
            className={styles.detail}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ ['--tint' as string]: AREAS[active].accent } as React.CSSProperties}
          >
            <div className={styles.detailGlow} aria-hidden />
            <div className={styles.detailMeta}>
              <span className={styles.detailIndex}>{AREAS[active].index}</span>
              <span className={styles.detailTag}>{AREAS[active].tag}</span>
            </div>
            <h3 className={styles.detailTitle}>{AREAS[active].title}</h3>
            <p className={styles.detailBody}>{AREAS[active].body}</p>
            <div className={styles.keywords}>
              {AREAS[active].keywords.map((k) => (
                <span key={k} className={styles.kw}>{k}</span>
              ))}
            </div>
            <div className={styles.detailFooter}>
              <span className={styles.detailFooterLabel}>STATUS</span>
              <span className={styles.detailFooterValue}>
                {active === 2 ? 'PUBLISHED · NTCIR-18 HIDDEN-RAD' : 'ACTIVE · LOOKING FOR COLLABORATORS'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
