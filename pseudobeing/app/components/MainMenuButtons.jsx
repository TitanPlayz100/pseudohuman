'use client'

import styles from '@/app/styles/home.module.css'
import io from "socket.io-client"
import { useEffect } from 'react';

const socket = io('http://localhost:3001');

export function MainMenuButtons() {
    function enterMatching() {
        const username = localStorage.getItem('username');
        socket.emit('enter-matchmaking', username);
    }

    useEffect(() => {
        const username = localStorage.getItem("username")
        socket.on('entered-matchmaking-' + username, (count) => {
            const amount = count;
            if (amount == 2) {
                localStorage.setItem('startgame', 'true');
                window.location = '/home/matching';
            } else if (amount == 1) {
                localStorage.setItem('startgame', 'false');
                window.location = '/home/matching';
            } else {
                console.log("Error occured");
            }
        });
    }, []);


    return (
        <div className={styles.buttondiv}>
            <button className={styles.button} onClick={enterMatching}>Join Queue</button>
            <button className={styles.button} disabled={true}>Private Game</button>
            <input type='text' maxLength={4} placeholder='Input code' className={styles.input} disabled={true}></input>
        </div>
    )
}