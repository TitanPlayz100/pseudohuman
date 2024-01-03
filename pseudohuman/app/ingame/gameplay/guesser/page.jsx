'use client'

import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react'
import { io } from "socket.io-client"

const socket = io('http://localhost:3001');

export default function Start() {
    const [isWaiting, setWaiting] = useState(true);
    const [info, setinfo] = useState({ question: "Loading", answers: ["loading", "loading", "loading"], correct: -1 });

    function selectAnswer(answer) {
        const gameid = localStorage.getItem('game_id');
        const playerNo = localStorage.getItem('playerNo');
        const isCorrect = answer == info.correct;
        socket.emit('guessed-answer', { gameid, playerNo, isCorrect });
    }

    useEffect(() => {
        const gameid = localStorage.getItem('game_id')

        socket.on('player-answered-' + gameid, (currentGame) => {
            setinfo({
                question: currentGame.question,
                answers: currentGame.answers,
                correct: currentGame.correctanswer
            })
            setWaiting(false);
        });

        socket.on('next-round-' + gameid, () => {
            window.location = '/ingame/result';
        });

        socket.on('end-game-' + gameid, () => {
            window.location = '/ingame/finish';
        });
    }, []);

    if (isWaiting) {
        // text for waiting for opponent to answer
        return (
            <div className={styles.parentdiv}>
                <h1 className={styles.text}>Waiting for other player's answer</h1>
                <p className={styles.text}>Do you have what it takes?</p>
            </div>
        )
    }

    else {
        // select options for the answer
        return (
            <div className={styles.parentdiv}>
                <h1>Question: {info.question}</h1>
                <p>Pick the option that seems most human</p>
                <button className={styles.button} onClick={() => selectAnswer(1)}>{info.answers[0]}</button>
                <button className={styles.button} onClick={() => selectAnswer(2)}>{info.answers[1]}</button>
                <button className={styles.button} onClick={() => selectAnswer(3)}>{info.answers[2]}</button>
            </div>
        )
    }
}