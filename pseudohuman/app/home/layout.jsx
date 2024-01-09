'use client'

import NavBar from "./navbar"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function RootLayout({ children }) {
  const path = usePathname()
  const router = useRouter();
  useEffect(() => {
    if (path != '/home/login/user') {
      if (localStorage.getItem('username') == null) {
        router.push('/home/login/user');
      }
    }
  }, [])

  return (
    <>
      <NavBar />
      {children}
    </>
  )
}
