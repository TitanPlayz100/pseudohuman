import styles from "@/app/styles/main.module.css"
import styles2 from './styles/navbar.module.css'
import Image from "next/image"

export const metadata = {
  title: 'PseudoHuman project',
  description: 'sdd major project',
}

function NavBar() {
  return (
      <div className={styles2.parentDiv}>
          <button className={styles2.Button}>hi</button>
          {/* <Image src="/placeholder.png" alt="Placeholder" width={100} height={100} /> */}
          <button className={styles2.Button}>hello</button>
      </div>
  )
}

export default function RootLayout({ children }) {
 return (
    <html className={styles.homepage}>
      <body>
        <NavBar/>
        {children}
        </body>
    </html>
  )
}
