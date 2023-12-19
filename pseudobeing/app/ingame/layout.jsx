import styles from '@/app/styles/main.module.css'
import PlayerBar from './topbar'

export default function RootLayout({ children }) {
  return (
    <html className={styles.homepage}>
      <body>
        <PlayerBar/>
        {children}
      </body>
    </html>
  )
}