'use client'

import styles from "@/app/styles/main.module.css"
import NavBar from "./navbar"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function RootLayout({ children }) {
  const path = usePathname()
  const router = useRouter();
  useEffect(() => {
    if (path != '/home/login/user') {
      if (localStorage.getItem('loggedIn') != 'true') {
        router.push('/home/login/user');
      }
    }

  }, [])


  return (
    <html className={styles.homepage}>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
