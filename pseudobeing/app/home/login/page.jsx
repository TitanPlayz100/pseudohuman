'use client'

import styles from '@/app/styles/main.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io('http://localhost:3001');

export default function loginPage() {
    const [inputUser, setInput] = useState('');
    const router = useRouter();
    
    const setuser = (event) => {
        setInput(event.target.value);
    };
    
    useEffect(() => {
        socket.on('checked-username', (resultobj) => {
            const result = resultobj.valid;
            const username = resultobj.user;
            redirectUser(result, username);
        });
    }, []);

    function pressedEnter(event) {
        if (event.key == "Enter") {
            if (inputUser == '') {
                console.log("Anonymous user");
                // TODO: set user to be anon when playing
                router.push('/home/mainmenu');
            }
            socket.emit('check-user', inputUser);
        }
        
    }
    
    function redirectUser(result, username) {
        localStorage.setItem("username", username);
        if (result) {
            router.push('/home/login/inputPassword');
        } else {
            router.push('/home/login/registerUsername');
        }
    }
    
    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Welcome</h1>
            <p className={styles.loginTextP}>Input a username, or leave blank to be anonymous. Press ENTER to continue</p>
            <input className={styles.loginInput} type='text' placeholder='Username' onChange={setuser} onKeyDown={pressedEnter} />
        </div>
    )

}