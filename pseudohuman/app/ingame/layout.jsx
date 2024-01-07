'use client'

import PlayerBar from './topbar'
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export default function RootLayout({ children }) {
  const path = usePathname();
  useEffect(() => {
    if (path != '/ingame/matching') {
      if (localStorage.getItem('game_id') == undefined) {
        window.location = '/home/mainmenu';
      }
    }

    const username = localStorage.getItem('username')
    socket.on('end-game-dc-' + username, async () => {
      localStorage.removeItem('game_id');
      localStorage.removeItem('playerNo');
      window.location = '/home/mainmenu';
    });

  }, []);

  return (
    <>
      <PlayerBar />
      {children}
    </>
  )
}