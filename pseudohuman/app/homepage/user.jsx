import { useEffect, useState } from 'react';
import styles from './login.module.css';
import PassInput from './password';
import RegUser from './register';
import MainMenu from './mainMenu';
import secureLocalStorage from 'react-secure-storage';
import { isProfane } from 'no-profanity';

export default function UserInput({ props }) {
    const { changeDisplay, changeUsername, urlUser } = props
    const [username, setInput] = useState('');
    const [bottomText, setBottomText] = useState(false);

    useEffect(() => {
        const tempUsername = secureLocalStorage.getItem('username');
        if (tempUsername == null) return;
        if (tempUsername != urlUser) setInput(tempUsername);
        changeUsername(tempUsername);
        changeDisplay(<MainMenu props={{ ...props, username: tempUsername }} />);
    }, [])

    async function pressedEnter(event) {
        if (event.key != "Enter") return;

        // makes sure username is longer than 3 characters
        if (username.length < 3) { setBottomText('Username too short'); return; }
        setBottomText('Loading');

        // swearing checker
        // uses custom library
        if (isProfane(username)) { setBottomText('Name is inappropriate'); return; }

        // fetch data from server
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/check_username", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const { valid } = await res.json();
            changeUsername(username);
            switch (valid) {
                case null: setBottomText('An error occured'); break;

                // if username was found on server
                case true: changeDisplay(<PassInput props={{ changeDisplay, changeUsername, username }} />); break;

                // if username was not found on server
                case false: changeDisplay(<RegUser props={{ changeDisplay, changeUsername, username }} />); break;
            }
        } catch (error) { setBottomText('An error occured'); }

    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Welcome</h1>
            <p className={styles.loginTextP}>Input a username, or leave blank to be anonymous. Press ENTER to continue</p>
            <input
                className={bottomText && bottomText != 'Loading' ? styles.loginInputError : styles.loginInput}
                type='text'
                placeholder='Username (between 3 to 10 characters)'
                onChange={event => { setInput(event.target.value); setBottomText(''); }}
                value={username}
                onKeyDown={pressedEnter}
                maxLength={10}
                minLength={3}
                autoFocus
            />
            <p className={styles.loginTextP}>{bottomText}</p>
        </div>
    )
}