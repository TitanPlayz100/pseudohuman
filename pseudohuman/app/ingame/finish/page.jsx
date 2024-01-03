'use client'

import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export default function Start() {
    const [results, setResults] = useState({});

    function calcPoints(points) {
        return (points[0] > points[1]) ?
            points[0] - points[1] :
            points[1] - points[0]
    }

    function sendMain() {
        window.location = '/home/mainmenu';
    }

    useEffect(() => {
        const gameid = localStorage.getItem('game_id');
        const username = localStorage.getItem('username');
        socket.emit('get-results', gameid, username);

        socket.on('got-results-' + gameid, (info) => {
            const winner = (info.winner == 'player1') ? info.player1.username : info.player2.username;
            const points = [info.player1.points, info.player2.points]
            const wonBy = calcPoints(points);
            setResults({ winner, points, wonBy })
            localStorage.removeItem('game_id');
            localStorage.removeItem('playerNo');
        });
    }, []);

    return (
        <div className={styles.parentdiv}>
            <h1 className={styles.text}>Player {results.winner} is the winner</h1>
            <h2 className={styles.text}>They won by {results.wonBy} points</h2>
            <button className={styles.submit} onClick={sendMain}>Main Menu</button>
        </div>
    )
}