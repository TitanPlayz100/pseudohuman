import styles from "@/app/styles/main.module.css"
import styles2 from './styles/navbar.module.css'
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: 'PseudoHuman project',
  description: 'sdd major project',
}

function NavBar() {
  return (
    <div className={styles2.parentDiv}>
      <ul className={styles2.ul}>
        <li className={styles2.li}><Image width={100} height={100} src="/cyborg.svg" alt="logo"/></li>
        <li className={styles2.li}><Link href="/home" className={styles2.litext}>PseudoHuman Project</Link></li>
      </ul>
      <ul className={styles2.ul}>
        <li className={styles2.li}><Link href='/login'><button className={styles2.Button + " " + styles2.loginbutton}>Login</button></Link></li>
      </ul>
    </div>
  )
}

export default function RootLayout({ children }) {
  return (
    <html className={styles.homepage}>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
