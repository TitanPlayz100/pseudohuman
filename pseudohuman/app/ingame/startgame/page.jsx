'use client'

import { io } from "socket.io-client"
import styles from '@/app/styles/startgame.module.css'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import url from '../http';

const socket = io(url());

export default function Start() {
    const [player, setPlayer] = useState(1);
    const [countdown, setCount] = useState(10);
    const starttext = ["You will be guessing the player's response first", "You will pretend to be an AI first"]
    const router = useRouter();

    useEffect(() => {
        setPlayer(localStorage.getItem('playerNo'))
        const gameid = localStorage.getItem('game_id')

        socket.on('countdown-' + gameid, (number) => {
            setCount(number);
        });
    }, []);

    useEffect(() => {
        const gameid = localStorage.getItem('game_id')
        socket.on('ready-' + gameid, (roundNo) => {
            if (player == 1) {
                router.push('/ingame/gameplay/guesser');
            } else if (player == 2) {
                router.push('/ingame/gameplay/pretender');
            }
        })
    }, [player])
    return (
        <div className={styles.startdialogue}>
            <h1 className={styles.text}>Starting Soon</h1>
            <p className={styles.text}>{starttext[player - 1]}</p>
            <p className={styles.text}>Starting in {countdown}</p>
            <p>Good Luck</p>
        </div>
    )
}