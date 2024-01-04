'use client'

import styles from '@/app/styles/main.module.css';
import { useState } from 'react';

export function RegisterUsername() {
    const [password, setInput] = useState('');

    const setuser = (event) => {
        setInput(event.target.value);
    };

    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }
        const username = localStorage.getItem('tempuser');
        await fetch("/api/register", { method: 'POST', body: JSON.stringify({ username, password }) });
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