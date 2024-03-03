import styles from '@/app/styles/main.module.css';
import { useEffect, useState } from 'react';
import MainMenu from './mainMenu';
import secureLocalStorage from 'react-secure-storage';

export default function PassInput({ props }) {
    const { username, changeDisplay } = props;
    const [password, setInput] = useState('');
    const [bottomText, setBottomText] = useState('');

    useEffect(() => {
        const tempPassword = secureLocalStorage.getItem('password');
        if (tempPassword != null) {
            setInput(tempPassword);
        }
    })

    async function pressedEnter(event) {
        if (event.key != "Enter") { return; }

        setBottomText('Loading');
        const res = await fetch("/api/check_password", { method: 'POST', body: JSON.stringify({ username, password }) });
        try {
            const { result } = await res.json();
            if (result) {
                secureLocalStorage.setItem('username', username);
                secureLocalStorage.setItem('password', password);
                changeDisplay(<MainMenu props={props} />);
                return;
            }
            setBottomText('Wrong, Try Again');
        } catch (error) {
            setBottomText('An Error Occured');
        }
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