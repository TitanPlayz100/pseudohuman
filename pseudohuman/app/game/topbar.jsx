import styles from './startgame.module.css'
import { useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

export default function PlayerBar({ socket }) {

    // default info
    const [info, setInfo] = useState({
        player1: { username: 'waiting', points: 0 },
        player2: { username: 'waiting', points: 0 }
    });

    useEffect(() => {
        // gets username from localstorage
        const username = secureLocalStorage.getItem('username');
        socket.on('update-navbar-' + username, (player1, player2) => {
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