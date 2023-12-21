'use client'

import styles from '@/app/styles/main.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export default function Password() {
    const [inputPass, setInput] = useState('');
    const router = useRouter();

    const setuser = (event) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        socket.on('registered-user', () => {
            router.push('/home/mainmenu');
        });
    }, []);
    
    
    function pressedEnter(event) {
        if (event.key == "Enter") {
            const username = localStorage.getItem('username');
            socket.emit('register-user',
            {
                username: username,
                password: inputPass
            });
        }
    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Register</h1>
            <p className={styles.loginTextP}>Input your new password. Press ENTER to continue</p>
            <input className={styles.loginInput} type='text' placeholder='New Password' onChange={setuser} onKeyDown={pressedEnter}/>
        </div>
    )

}