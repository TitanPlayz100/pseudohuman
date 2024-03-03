import styles from '@/app/styles/main.module.css';
import { useState } from 'react';
import MainMenu from './mainMenu';

export default function RegUser({ props }) {
    const { username, changeDisplay } = props;
    const [password, setInput] = useState('');
    const [bottomText, setBottomText] = useState('');

    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }

        setBottomText('Loading');
        const res = await fetch("/api/register", { method: 'POST', body: JSON.stringify({ username, password }) });

        try {
            await res.json();
            secureLocalStorage.setItem('username', username);
            secureLocalStorage.setItem('password', password);
            changeDisplay(<MainMenu props={props} />)
        } catch (error) {
            console.log(error)
            setBottomText('An Error Occured');
        }
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