import styles from './login.module.css';
import { useState } from 'react';
import MainMenu from './mainMenu';
import secureLocalStorage from 'react-secure-storage';

export default function RegUser({ props }) {
    const { username, changeDisplay } = props;
    const [password, setInput] = useState('');
    const [bottomText, setBottomText] = useState('');


    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }
        if (password.length < 7) {
            setBottomText('Password too short');
            return;
        }

        setBottomText('Loading');

        // fetch data from server
        const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/register", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        try {
            const { processed } = await res.json();
            if (!processed) { setBottomText('An error occured'); return }

            // encrypts username and stores it to later validate
            secureLocalStorage.setItem('username', username);
            changeDisplay(<MainMenu props={props} />)
        }
        catch (error) { setBottomText('An internal error occured'); }
    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Register</h1>
            <p className={styles.loginTextP}>Input your new password. Press ENTER to continue<br />Your password MUST be at least 7 characters</p>

            {/* password input to hide text */}
            <input
                className={bottomText && bottomText != 'Loading' ? styles.loginInputError : styles.loginInput}
                type='password'
                style={{ fontFamily: 'Arial' }}
                onChange={event => { setInput(event.target.value); setBottomText(''); }}
                onKeyDown={pressedEnter}
                autoFocus
                minLength={7}
            />
            <p className={bottomText == 'Loading' ? styles.loginTextP : styles.incorrect}>{bottomText}</p>
        </div>

    )
}