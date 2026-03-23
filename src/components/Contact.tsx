import styles from './Contact.module.css'

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <a href="https://github.com/jumincho" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p className={styles.copy}>&copy; JUMIN CHO {year}</p>
      </div>
    </footer>
  )
}
