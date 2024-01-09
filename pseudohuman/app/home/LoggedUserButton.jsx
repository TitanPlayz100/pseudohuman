'use client'

import styles from '@/app/styles/navbar.module.css'
import { useEffect, useState } from 'react';

export function LogoutButton() {
    const [username, setUser] = useState('Loading');

    useEffect(() => {
        const user = localStorage.getItem('username');
        setUser(user == null ? "Login" : user);
    }, []);

    function logout() {
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