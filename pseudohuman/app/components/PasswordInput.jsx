'use client'

import styles from '@/app/styles/main.module.css';
import { useState } from 'react';

export function PasswordInput() {
    const [password, setInput] = useState('');
    const [isWrong, setWrong] = useState(false);

    const setuser = (event) => {
        setInput(event.target.value);
    };

    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }
        const username = localStorage.getItem('tempuser');
        const res = await fetch("/api/check_password", { method: 'POST', body: JSON.stringify({ username, password }) });
        const { result } = await res.json();
        if (result) {
            localStorage.setItem('loggedIn', true);
            localStorage.setItem('username', username);
            localStorage.removeItem('tempuser');
            window.location = '/home/mainmenu'
        } else {
            setWrong(true);
        }
    }

    return (
        <>
            {isWrong ? <p className={styles.incorrect}>Incorrect, try again</p> : <></>}
            <input
                className={styles.loginInput}
                type='password'
                placeholder='Password'
                onChange={setuser}
                onKeyDown={pressedEnter}
                autoFocus
            />
        </>
    )
}