'use client'

import styles from '@/app/styles/navbar.module.css'
import { useEffect, useState } from 'react';

export function LogoutButton() {
    const [username, setUser] = useState('Login');

    useEffect(() => {
        const user = localStorage.getItem('username');
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn) {
            if (user != "null") {
                setUser(user);
            }
        }
    }, []);

    function logout() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        window.location = '/home/login/user';
    }

    return (
        <button
            className={styles.Button + " " + styles.loginbutton}
            onClick={logout}>
            {username}
        </button>
    )
}