'use client'

import styles from '@/app/styles/main.module.css';
import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export function RegisterUsername() {
    const [inputPass, setInput] = useState('');

    const setuser = (event) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        const username = localStorage.getItem('tempuser');
        socket.on('registered-user-' + username, () => {
            localStorage.setItem('loggedIn', true);
            localStorage.setItem('username', username);
            window.location = '/home/mainmenu'
        });
    }, []);


    function pressedEnter(event) {
        if (event.key == "Enter") {
            const username = localStorage.getItem('tempuser');
            socket.emit('register-user',
                {
                    username: username,
                    password: inputPass
                });
        }
    }

    return (
        <input
            className={styles.loginInput}
            type='password'
            placeholder='New Password'
            onChange={setuser}
            onKeyDown={pressedEnter}
        />
    )
}