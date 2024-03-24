import styles from '@/app/styles/main.module.css';
import { useState } from 'react';
import MainMenu from './mainMenu';
import secureLocalStorage from 'react-secure-storage';

const server = (process.env.NEXT_PUBLIC_SERVER == "DEV")
    ? 'http://localhost:3001'
    : 'https://pseudobeing-server.onrender.com';


export default function RegUser({ props }) {
    const { username, changeDisplay } = props;
    const [password, setInput] = useState('');
    const [bottomText, setBottomText] = useState('');


    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }

        setBottomText('Loading');
        const res = await fetch(server + "/register", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        try {
            const { processed } = await res.json();
            if (!processed) { setBottomText('An error occured'); return }
            secureLocalStorage.setItem('username', username);
            changeDisplay(<MainMenu props={props} />)
        }
        catch (error) { setBottomText('An internal error occured'); }

    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Register</h1>
            <p className={styles.loginTextP}>Input your new password. Press ENTER to continue<br />Your password MUST be at least 7 characters</p>
            <input
                className={styles.loginInput}
                type='password'
                placeholder='New Password'
                onChange={event => setInput(event.target.value)}
                onKeyDown={pressedEnter}
                autoFocus
                minLength={7}
            />
            <p className={styles.incorrect}>{bottomText}</p>
        </div>

    )
}