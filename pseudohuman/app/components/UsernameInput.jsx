'use client'

import { useState } from 'react';
import styles from '@/app/styles/main.module.css';

export function UsernameInput() {
    const [username, setInput] = useState('');

    const setuser = (event) => {
        setInput(event.target.value);
    };

    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }
        if (username == '') { return; }
        const res = await fetch("/api/check_username", { method: 'POST', body: JSON.stringify({ username }) });
        const { valid } = await res.json();
        localStorage.setItem("tempuser", username);
        window.location = valid ? '/home/login/inputPassword' : '/home/login/registerUsername'
    }

    return (
        <input
            className={styles.loginInput}
            type='text'
            placeholder='Username (max 10 characters)'
            onChange={setuser}
            onKeyDown={pressedEnter}
            maxLength={10}
            autoFocus
        />
    )
}