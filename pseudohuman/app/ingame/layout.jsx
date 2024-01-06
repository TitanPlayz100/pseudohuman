'use client'

import styles from '@/app/styles/main.module.css'
import PlayerBar from './topbar'
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const path = usePathname()
  useEffect(() => {
    if (path != '/ingame/matching') {
      if (localStorage.getItem('game_id') == undefined) {
        window.location = '/home/mainmenu';
      }
    }

  }, []);

  return (
    <html className={styles.homepage}>
      <body>
        <PlayerBar />
        {children}
      </body>
    </html>
  )
}