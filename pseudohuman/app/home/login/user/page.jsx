'use client'

import { useState } from 'react';
import styles from '@/app/styles/main.module.css';
import { useRouter } from 'next/navigation';

export default function UserInput() {
    const [username, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const setuser = (event) => {
        setInput(event.target.value);
    };

    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }
        if (username == '') { return; }
        setLoading(true);
        const res = await fetch("/api/check_username", { method: 'POST', body: JSON.stringify({ username }) });
        const { valid } = await res.json();
        localStorage.setItem("tempuser", username);
        router.push(valid ? '/home/login/password' : '/home/login/register')
    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Welcome</h1>
            <p className={styles.loginTextP}>Input a username, or leave blank to be anonymous. Press ENTER to continue</p>
            <input
                className={styles.loginInput}
                type='text'
                placeholder='Username (max 10 characters)'
                onChange={setuser}
                onKeyDown={pressedEnter}
                maxLength={10}
                autoFocus
            />
            <p className={styles.loginTextP}>{loading ? "Loading" : ""}</p>
        </div>
    )
}