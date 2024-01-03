'use client'

import styles from '@/app/styles/main.module.css';
import { useState } from 'react';

export function PasswordInput() {
    const [inputPass, setInput] = useState('');
    const [isWrong, setWrong] = useState(false);

    const setuser = (event) => {
        setInput(event.target.value);
    };

    function pressedEnter(event) {
        if (event.key == "Enter") {
            const username = localStorage.getItem('tempuser');
            check_password(username, inputPass);
        }
    }

    async function check_password(username, password) {
        const res = await fetch("http://localhost:3001/api/check-password",
            {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
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