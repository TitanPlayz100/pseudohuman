import styles from '@/app/styles/navbar.module.css'
import Image from "next/image"
import { LogoutButton } from './LoggedUserButton';

export default function NavBar({ props }) {
  return (
    <div className={styles.parentDiv}>
      <ul className={styles.ul}>
        <li className={styles.li}><Image width={100} height={100} src="/cyborg.svg" alt="logo" className={styles.image} priority /></li>
        <li className={styles.li}><span className={styles.litext}>PseudoHuman Project</span></li>
      </ul>
      <ul className={styles.ul}>
        <li className={styles.li}><LogoutButton props={props} /></li>
      </ul>
    </div>
  )
}