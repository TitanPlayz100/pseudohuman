'use client'

import styles from '@/app/styles/main.module.css';
import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export function PasswordInput() {
    const [inputPass, setInput] = useState('');
    const [isWrong, setWrong] = useState(false);

    const setuser = (event) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        const username = localStorage.getItem('tempuser');
        socket.on('checked-password-' + username, (result) => {
            if (result) {
                localStorage.setItem('loggedIn', true);
                localStorage.setItem('username', username);
                window.location = '/home/mainmenu'
            } else {
                setWrong(true);
            }
        });
    }, []);


    function pressedEnter(event) {
        if (event.key == "Enter") {
            const username = localStorage.getItem('tempuser');
            socket.emit('check-password', { username: username, password: inputPass });
        }
    }

    return (
        <>
            {isWrong ? <p className={styles.incorrect}>THE PASSWORD IS WRONG</p> : <></>}
            <input
                className={styles.loginInput}
                type='password'
                placeholder='Password'
                onChange={setuser}
                onKeyDown={pressedEnter}
            />
        </>
    )
}