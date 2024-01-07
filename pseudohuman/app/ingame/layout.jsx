'use client'

import PlayerBar from './topbar'
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
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

    const gameid = localStorage.getItem('game_id');
    const username = localStorage.getItem('username')
    socket.on('end-game-dc-' + gameid, async () => {
      localStorage.removeItem('game_id');
      localStorage.removeItem('playerNo');
      window.location = '/home/mainmenu';
      await fetch("/api/change_points", { method: 'POST', body: JSON.stringify({ username, type: 'add', amount: 1 }) });
    });

  }, []);

  return (
    <>
      <PlayerBar />
      {children}
    </>
  )
}