import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import ShaderBackground from '../components/ShaderBackground'
import Cursor from '../components/Cursor'
import HeroCinematic from '../components/landing/HeroCinematic'
import Marquee from '../components/landing/Marquee'
import ResearchShowcase from '../components/landing/ResearchShowcase'
import JourneyTimeline from '../components/landing/JourneyTimeline'
import LandingFooter from '../components/landing/LandingFooter'
import styles from './Home.module.css'

export default function Home() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    document.documentElement.classList.add('dark-page')
    return () => document.documentElement.classList.remove('dark-page')
  }, [])

  return (
    <div className={styles.wrap} id="top">
      <ShaderBackground />
      <Cursor />
      <motion.div className={styles.progress} style={{ scaleX: progress }} aria-hidden />
      <div className={styles.grain} aria-hidden />
      <div className={styles.content}>
        <HeroCinematic />
        <Marquee />
        <ResearchShowcase />
        <JourneyTimeline />
        <LandingFooter />
      </div>
    </div>
  )
}
