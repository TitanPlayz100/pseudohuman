'use client'

import { useEffect, useState } from 'react';
import io from "socket.io-client"
import styles from '@/app/styles/main.module.css';

const socket = io('http://localhost:3001');

export function UsernameInput() {
    const [inputUser, setInput] = useState('');

    const setuser = (event) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        socket.on('checked-username-' + inputUser, (resultobj) => {
            const result = resultobj.valid;
            const username = resultobj.user;
            localStorage.setItem("tempuser", username);
            if (result == true) {
                window.location = '/home/login/inputPassword';
            } else {
                window.location = '/home/login/registerUsername';
            }
        });
    }, [inputUser]);

    function pressedEnter(event) {
        if (event.key == "Enter") {
            if (inputUser == '') {
                // localStorage.setItem("username", 'anon');
                // window.location = '/home/mainmenu'
                window.location = '/home/login'
            } else {
                socket.emit('check-user', inputUser);
            }
        }
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