'use client'

import styles from '@/app/styles/main.module.css'
import dots from '@/app/styles/loadingdots.module.css'
import { useEffect, useState } from 'react'
import io from "socket.io-client"
import { useRouter } from 'next/navigation'

const socket = io('http://localhost:3001');

export default function Matching() {
    const [startgame, setStartgame] = useState(false);
    const router = useRouter();

    function hasFoundPlayer(foundPlayer) {
        if (foundPlayer) {
            return <h1 className={styles.loadingtext}>Player Found!</h1>;
        } else {
            return <h1 className={styles.loadingtext + " " + dots.loading}>Waiting For Another Player</h1>;
        }
    }

    useEffect(() => {
        const start = localStorage.getItem('startgame');
        if (start == 'false') {
            setStartgame(false);
        } else if (start == 'true') {
            setStartgame(true);
        }
    }, [localStorage.getItem('startgame')]);

    useEffect(() => {
        socket.on('entered-matchmaking', (resultobj) => {
            const amount = resultobj.amount;
            if (amount == 2) {
                localStorage.setItem('startgame', 'true');
                router.push('/home/matching');
            } else if (amount == 1) {
                localStorage.setItem('startgame', 'false');
                router.push('/home/matching');
            } else {
                console.log("Error occured");
            }
        });
    }, []);

    return (
        <div className={styles.loginDiv}>
            {hasFoundPlayer(startgame)}
        </div>
    )
}