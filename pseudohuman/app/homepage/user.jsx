import { useEffect, useState } from 'react';
import styles from '@/app/styles/main.module.css';
import PassInput from './password';
import RegUser from './register';
import MainMenu from './mainMenu';
import secureLocalStorage from 'react-secure-storage';


export default function UserInput({ props }) {
    const { changeDisplay, changeUsername, urlUser } = props
    const [username, setInput] = useState('');
    const [bottomText, setBottomText] = useState('');

    useEffect(() => {
        const tempUsername = secureLocalStorage.getItem('username');
        if (tempUsername == null) return;
        if (tempUsername != urlUser) setInput(tempUsername);
        changeUsername(username);
        changeDisplay(<MainMenu props={props} />);
    }, [])

    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }
        if (username == '') { return; }

        setBottomText('Loading');

        const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/check_username", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        try {
            const { valid } = await res.json();
            changeUsername(username);
            switch (valid) {
                case null: setBottomText('An error occured'); break;
                case true: changeDisplay(<PassInput props={{ changeDisplay, changeUsername, username }} />); break;
                case false: changeDisplay(<RegUser props={{ changeDisplay, changeUsername, username }} />); break;
            }
        }
        catch (error) { setBottomText('An internal error occured'); }

    }

    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Welcome</h1>
            <p className={styles.loginTextP}>Input a username, or leave blank to be anonymous. Press ENTER to continue</p>
            <input
                className={styles.loginInput}
                type='text'
                placeholder='Username (between 3 to 10 characters)'
                onChange={event => setInput(event.target.value)}
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