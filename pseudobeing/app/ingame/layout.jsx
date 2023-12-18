import styles from '@/app/styles/main.module.css'
export default function RootLayout({ children }) {
  return (
    <html className={styles.homepage}>
      <body>
        {children}
      </body>
    </html>
  )
}