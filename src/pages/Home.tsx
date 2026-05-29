import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import ShaderBackground from '../components/ShaderBackground'
import Cursor from '../components/Cursor'
import IntroSequence from '../components/intro/IntroSequence'
import HeroCinematic from '../components/landing/HeroCinematic'
import Marquee from '../components/landing/Marquee'
import JourneyTimeline from '../components/landing/JourneyTimeline'
import LandingFooter from '../components/landing/LandingFooter'
import styles from './Home.module.css'

export default function Home() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  // Pack-opening intro: once per tab session, never for reduced-motion users.
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem('introSeen') !== '1'
  })

  useEffect(() => {
    document.documentElement.classList.add('dark-page')
    return () => document.documentElement.classList.remove('dark-page')
  }, [])

  useEffect(() => {
    if (!showIntro) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [showIntro])

  const endIntro = () => {
    sessionStorage.setItem('introSeen', '1')
    setShowIntro(false)
  }

  return (
    <div className={styles.wrap} id="top">
      {showIntro && <IntroSequence onComplete={endIntro} />}
      {!showIntro && (
        <>
          <ShaderBackground />
          <Cursor />
          <motion.div className={styles.progress} style={{ scaleX: progress }} aria-hidden />
          <div className={styles.grain} aria-hidden />
          <div className={styles.content}>
            <HeroCinematic />
            <Marquee />
            <JourneyTimeline />
            <LandingFooter />
          </div>
        </>
      )}
    </div>
  )
}
