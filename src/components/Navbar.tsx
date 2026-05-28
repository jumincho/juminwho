import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useAdminAuth } from '../context/AdminAuthContext'
import styles from './Navbar.module.css'

interface Props {
  dark: boolean
}

const ITEMS = [
  { to: '/cv', label: 'CV', tag: '01' },
  { to: '/projects', label: 'Projects', tag: '02' },
  { to: '/blog', label: 'Blog', tag: '03' },
] as const

export default function Navbar({ dark }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { isAdmin, logout, openLogin } = useAdminAuth()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.4 })

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navClass = [
    styles.nav,
    scrolled ? styles.scrolled : '',
    dark ? styles.dark : '',
  ].filter(Boolean).join(' ')

  return (
    <nav className={navClass}>
      <motion.div className={styles.progress} style={{ scaleX: progress }} aria-hidden />

      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark} aria-hidden>
            <span className={styles.logoDot} />
          </span>
          <span className={styles.logoText}>
            <span className={styles.logoLine1}>JUMIN</span>
            <span className={styles.logoLine2}>CHO</span>
          </span>
        </Link>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 토글"
        >
          <span /><span /><span />
        </button>

        <div className={`${styles.links} ${menuOpen ? styles.mobileOpen : ''}`}>
          {ITEMS.map((item) => {
            const active =
              item.to === '/blog'
                ? location.pathname.startsWith('/blog')
                : location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`${styles.link} ${active ? styles.active : ''}`}
              >
                <span className={styles.linkTag}>{item.tag}</span>
                <span className={styles.linkLabel}>{item.label}</span>
                <span className={styles.linkUnderline} aria-hidden />
              </Link>
            )
          })}
          <button
            type="button"
            className={`${styles.admin} ${isAdmin ? styles.adminActive : ''}`}
            onClick={isAdmin ? logout : () => openLogin(location.pathname)}
          >
            <span className={styles.adminDot} />
            <span>{isAdmin ? 'ADMIN · LOGOUT' : 'ADMIN'}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
