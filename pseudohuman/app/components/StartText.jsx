'use client'

import { io } from "socket.io-client"
import styles from '@/app/styles/startgame.module.css'
import { useEffect, useState } from "react";

const socket = io('http://localhost:3001');

export function IntroText() {
    const [player, setPlayer] = useState(1);
    const [countdown, setCount] = useState(5);
    const starttext = ["You will be guessing the player's response first, then on the next round you will pretend to be an AI", "You will pretend to be an AI first, then in the next round you will be guessing the player's response"]

    useEffect(() => {
        setPlayer(localStorage.getItem('playerNo'))
        const gameid = localStorage.getItem('game_id')

        socket.on('countdown-' + gameid, (number) => {
            setCount(number);
        });

        socket.on('ready-' + gameid, (value) => {
            console.log(value);
        })
    }, []);


    return (
        <>
            <p className={styles.text}>{starttext[player - 1]}</p>
            <p className={styles.text}>Starting in {countdown}</p>
        </>
    )
}