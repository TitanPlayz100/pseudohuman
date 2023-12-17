import styles from "@/app/main.module.css"

export const metadata = {
  title: 'PseudoHuman project',
  description: 'sdd major project',
}

export default function RootLayout({ children }) {
 return (
    <html className={styles.homepage}>
      <body>{children}</body>
    </html>
  )
}
