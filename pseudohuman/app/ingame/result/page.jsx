'use client'

import styles from '@/app/styles/gameplay.module.css'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export default function Start() {
    const [winner, setWinner] = useState("Player_1");
    const [countdown, setCount] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const gameid = localStorage.getItem('game_id')
        const playerNo = localStorage.getItem('playerNo')

        socket.on('countdown-' + gameid, (number) => {
            setCount(number);
        });

        socket.emit('get-current-winner', gameid);

        socket.on('got-current-winner-' + gameid, (player) => {
            setWinner(player);
        });

        socket.on('ready-' + gameid, (matchNo) => {
            if (matchNo % 2 == 1) {
                if (playerNo == 1) {
                    router.push('/ingame/gameplay/guesser');
                } else if (playerNo == 2) {
                    router.push('/ingame/gameplay/pretender');
                }
            } else {
                if (playerNo == 1) {
                    router.push('/ingame/gameplay/pretender');
                } else if (playerNo == 2) {
                    router.push('/ingame/gameplay/guesser');
                }
            }

        })
    }, []);

    return (
        <div className={styles.parentdiv}>
            <h1 className={styles.text}>{winner} is the winner</h1>
            <h2 className={styles.text}>Next round starting in {countdown}</h2>
        </div>
    )
}