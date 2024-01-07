'use client'

import styles from '@/app/styles/startgame.module.css'
import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export default function PlayerBar() {
    const [info, setInfo] = useState({ player1: { username: 'waiting', points: 0 }, player2: { username: 'waiting', points: 0 } });

    useEffect(() => {
        const username = localStorage.getItem('username');
        socket.on('update-navbar-' + username, ({ player1, player2 }) => {
            setInfo({ player1, player2 })
        });
    }, []);

    return (
        <div className={styles.playersdiv}>
            <p className={styles.playerstext}>{info.player1.points}</p>
            <p className={styles.vstext}>{info.player1.username}  VS  {info.player2.username}</p>
            <p className={styles.playerstext}>{info.player2.points}</p>
        </div>
    )
}