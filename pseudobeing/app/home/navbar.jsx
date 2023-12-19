import styles2 from '@/app/styles/navbar.module.css'
import Image from "next/image"
import Link from "next/link"

export default function NavBar() {
  return (
    <div className={styles2.parentDiv}>
      <ul className={styles2.ul}>
        <li className={styles2.li}><Image width={100} height={100} src="/cyborg.svg" alt="logo" className={styles2.image}/></li>
        <li className={styles2.li}><Link href="/home/mainmenu" className={styles2.litext}>PseudoHuman Project</Link></li>
      </ul>
      <ul className={styles2.ul}>
        <li className={styles2.li}><Link href='/home/login'><button className={styles2.Button + " " + styles2.loginbutton}>Login</button></Link></li>
      </ul>
    </div>
  )
}