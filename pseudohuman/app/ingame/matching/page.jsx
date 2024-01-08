'use client'

import styles from '@/app/styles/main.module.css'
import dots from '@/app/styles/loadingdots.module.css'
import { useEffect, useState } from 'react'
import io from "socket.io-client"
import { useRouter } from 'next/navigation'
import url from '../http'

const socket = io(url());

export default function MatchingScreen() {
    const router = useRouter();
    const [startgame, setStartgame] = useState(false);

    function hasFoundPlayer(foundPlayer) {
        if (foundPlayer) {
            return <h1 className={styles.loadingtext}>Player Found!</h1>;
        } else {
            return <h1 className={styles.loadingtext + " " + dots.loading}>Waiting For Another Player</h1>;
        }
    }

    useEffect(() => {
        const username = localStorage.getItem('username');
        socket.emit('enter-matchmaking', username);
    }, [])

    useEffect(() => {
        const username = localStorage.getItem('username');
        socket.on('start-game', (game_id) => {
            localStorage.setItem("game_id", game_id);
            setStartgame(true);
            router.push('/ingame/startgame');
        });

        socket.on('setup-' + username, (object) => {
            localStorage.setItem('playerNo', object.playerNo);
        });

        window.onbeforeunload = () => {
            socket.emit('user-disconnected', username);
            localStorage.removeItem('game_id');
            localStorage.removeItem('playerNo');
        }

    }, []);

    return (
        <div className={styles.loginDiv}>
            {hasFoundPlayer(startgame)}
        </div>
    )
}