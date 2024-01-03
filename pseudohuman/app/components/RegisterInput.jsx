'use client'

import styles from '@/app/styles/main.module.css';
import { useState } from 'react';

export function RegisterUsername() {
    const [inputPass, setInput] = useState('');

    const setuser = (event) => {
        setInput(event.target.value);
    };

    function pressedEnter(event) {
        if (event.key == "Enter") {
            const username = localStorage.getItem('tempuser');
            let password = inputPass;
            register_user(username, password);
        }
    }

    async function register_user(username, password) {
        await fetch("http://localhost:3001/api/register-user",
            {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('username', username);
        localStorage.removeItem('tempuser');
        window.location = '/home/mainmenu'
    }

    return (
        <input
            className={styles.loginInput}
            type='password'
            placeholder='New Password'
            onChange={setuser}
            onKeyDown={pressedEnter}
            autoFocus
        />
    )
}