'use client'

import { useEffect, useState } from "react";
import io from "socket.io-client"
import PlayerBar from "./topbar";
import MatchingScreen from "./matching";
import styles from '@/app/styles/main.module.css'
import secureLocalStorage from "react-secure-storage";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

export default function GamePage() {
    const [display, setDisplay] = useState(<div className={styles.loginDiv}><h1 className={styles.loadingtext}>Loading</h1></div>);
    const changeDisplay = display => setDisplay(display);

    useEffect(() => {
        const username = secureLocalStorage.getItem('username');
        if (username == null) { throw new Error('The username was not saved. Please try logging in again to validate username'); }
        setDisplay(<MatchingScreen props={{ socket, changeDisplay, username }} />)

        // detect other user disconnected
        socket.on('end-game-dc-' + username, () => {
            window.location = '/?username=' + username;
            console.log('user disconnected');
            socket.disconnect();
        });

        // Detect disconnect
        window.onbeforeunload = () => {
            secureLocalStorage.removeItem('game_id');
            console.log('other user disconnected');
            socket.emit('user-disconnected', username);
        }
    }, []);

    return (
        <>
            <PlayerBar socket={socket} />
            {display}
        </>
    )

}