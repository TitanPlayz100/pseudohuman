'use client'

import { useEffect, useState } from "react";
import io from "socket.io-client"
import PlayerBar from "./topbar";
import MatchingScreen from "./matching";
import { useRouter } from "next/navigation";
import styles from '@/app/styles/main.module.css'

const connection = (process.env.NEXT_PUBLIC_SERVER == "DEV") ? 'http://localhost:3001' : 'https://pseudobeing-server.onrender.com'
const socket = io(connection);

export default function GamePage() {
    const [display, setDisplay] = useState(<div className={styles.loginDiv}><h1 className={styles.loadingtext}>Loading</h1></div>);
    const changeDisplay = (display) => { setDisplay(display) };
    const router = useRouter();

    useEffect(() => {
        const username = localStorage.getItem('username');
        setDisplay(<MatchingScreen props={{ socket, changeDisplay, username }} />)

        // Detect disconnect
        window.onbeforeunload = () => {
            socket.emit('user-disconnected', username);
            localStorage.removeItem('game_id');
            localStorage.removeItem('playerNo');
        }

        // detect other user disconnected
        socket.on('end-game-dc-' + username, async () => {
            localStorage.removeItem('game_id');
            localStorage.removeItem('playerNo');
            router.push('/home/mainmenu');
            socket.disconnect();
        });
    }, []);

    return (
        <>
            <PlayerBar socket={socket} />
            {display}
        </>
    )

}