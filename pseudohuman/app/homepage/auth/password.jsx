import styles from './login.module.css';
import { useState } from 'react';
import MainMenu from '../mainMenu';
import secureLocalStorage from 'react-secure-storage';

export default function PassInput({ props }) {
    const { username, changeDisplay } = props;
    const [password, setInput] = useState('');
    const [bottomText, setBottomText] = useState('');

    async function pressedEnter(event) {
        if (event.key != 'Enter') return;

        setBottomText('Loading');

        // fetch data from server
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/check_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const { valid } = await res.json();
            switch (valid) {
                case null:
                    setBottomText('An error occured');
                    break;
                case false:
                    setBottomText('Wrong, Try Again');
                    break;
                case true:
                    // stores the username on encrypted localstorage in order to validate it later
                    // uses a custom library
                    secureLocalStorage.setItem('username', username);
                    changeDisplay(<MainMenu props={props} />);
                    break;
            }
        } catch (error) {
            setBottomText('An internal error occured');
        }
    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Password</h1>
            <p className={styles.loginTextP}>Input your Password. Press ENTER to continue</p>
            <input
                className={bottomText && bottomText != 'Loading' ? styles.loginInputError : styles.loginInput}

                // the main font didnt support circle characters to hide password
                style={{ fontFamily: 'Arial' }}
                type='password'
                onChange={event => {
                    setInput(event.target.value);
                    setBottomText('');
                }}
                onKeyDown={pressedEnter}
                value={password}
                autoFocus
            />
            <p className={bottomText == 'Loading' ? styles.loginTextP : styles.incorrect}>{bottomText}</p>
        </div>
    );
}
