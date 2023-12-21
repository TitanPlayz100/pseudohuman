'use client'

import styles from '@/app/styles/main.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export default function Password() {
    const [inputPass, setInput] = useState('');
    const [isWrong, setWrong] = useState(false);
    const router = useRouter();

    const setuser = (event) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        socket.on('checked-password', (result) => {
            if (result) {
                router.push('/home/mainmenu');
            } else {
                setWrong(true);
            }
        });
    }, []);
    
    
    function pressedEnter(event) {
        if (event.key == "Enter") {
            const username = localStorage.getItem('username');
            socket.emit('check-password',
            {
                username: username,
                password: inputPass
            });
        }
    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Password</h1>
            <p className={styles.loginTextP}>Input your Password. Press ENTER to continue</p>
            {isWrong?<p className={styles.incorrect}>THE PASSWORD IS WRONG</p> :<></>}
            <input className={styles.loginInput} type='password' placeholder='Password' onChange={setuser} onKeyDown={pressedEnter}/>
        </div>
    )

}