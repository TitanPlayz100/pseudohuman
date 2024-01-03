'use client'

import { useState } from 'react';
import styles from '@/app/styles/main.module.css';

export function UsernameInput() {
    const [inputUser, setInput] = useState('');

    const setuser = (event) => {
        setInput(event.target.value);
    };

    function pressedEnter(event) {
        if (event.key == "Enter") {
            if (inputUser == '') {
                // localStorage.setItem("username", 'anon');
                // window.location = '/home/mainmenu'
                window.location = '/home/login'
            } else {
                check_username(inputUser);
            }
        }
    }

    async function check_username(username) {
        const res = await fetch("http://localhost:3001/api/check-user",
            {
                method: 'POST',
                body: JSON.stringify({ username }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        const { valid } = await res.json();
        localStorage.setItem("tempuser", username);
        window.location = valid ? '/home/login/inputPassword' : '/home/login/registerUsername'
    };

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