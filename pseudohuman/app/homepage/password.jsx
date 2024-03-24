import styles from '@/app/styles/main.module.css';
import { useState } from 'react';
import MainMenu from './mainMenu';
import secureLocalStorage from 'react-secure-storage';

const server = (process.env.NEXT_PUBLIC_SERVER == "DEV")
    ? 'http://localhost:3001'
    : 'https://pseudobeing-server.onrender.com';


export default function PassInput({ props }) {
    const { username, changeDisplay } = props;
    const [password, setInput] = useState('');
    const [bottomText, setBottomText] = useState('');


    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }

        setBottomText('Loading');

        const res = await fetch(server + "/check_password", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        try {
            const { valid } = await res.json();
            switch (valid) {
                case null: setBottomText('An error occured'); break;
                case false: setBottomText('Wrong, Try Again'); break;
                case true:
                    secureLocalStorage.setItem('username', username);
                    changeDisplay(<MainMenu props={props} />); break;
            }
        }
        catch (error) { setBottomText('An internal error occured'); }


    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Password</h1>
            <p className={styles.loginTextP}>Input your Password. Press ENTER to continue</p>
            <input
                className={styles.loginInput}
                type='password'
                placeholder='Password'
                onChange={event => setInput(event.target.value)}
                onKeyDown={pressedEnter}
                value={password}
                autoFocus
            />
            <p className={styles.incorrect}>{bottomText}</p>
        </div>
    )
}