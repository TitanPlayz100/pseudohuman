'use client'

import styles from '@/app/styles/home.module.css'
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export function MainMenuButtons() {
    function enterMatching() {
        const username = localStorage.getItem('username');
        socket.emit('enter-matchmaking', username);
        window.location = '/home/matching';
    }

    return (
        <div className={styles.buttondiv}>
            <button className={styles.button} onClick={enterMatching}>Join Queue</button>
            <button className={styles.button} disabled={true}>Private Game</button>
            <input type='text' maxLength={4} placeholder='Input code' className={styles.input} disabled={true}></input>
        </div>
    )
}