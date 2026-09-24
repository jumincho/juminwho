import { labels } from './data/profile'
import { useLanguage } from './hooks/useLanguage'
import Backdrop from './layout/Backdrop'
import Footer from './layout/Footer'
import Header from './layout/Header'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Honors from './sections/Honors'
import JuminTime from './sections/JuminTime'
import Publications from './sections/Publications'
import styles from './App.module.css'

export default function App() {
  const { t } = useLanguage()
  return (
    <>
      <a className="skip-link" href="#main">
        {t(labels.skipToContent)}
      </a>
      <Backdrop />
      <Header />
      <main id="main" className={`page ${styles.main}`}>
        <Hero />
        <JuminTime />
        <Publications />
        <Experience />
        <Education />
        <Honors />
      </main>
      <Footer />
    </>
  )
}
