'use client'

import PlayerBar from './topbar'
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import io from "socket.io-client"
import url from './http';


const socket = io(url());

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