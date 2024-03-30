import styles from '@/app/styles/startgame.module.css'
import { useEffect, useState } from "react";
import Guesser from './guessing';
import Pretender from './pretending';

export default function Start({ props }) {
    const { socket, changeDisplay, game_id, playerNo, startText } = props;
    const [countdown, setCount] = useState(5);
    const [prepared, setPrepared] = useState(false);

    useEffect(() => {
        socket.on('countdown-' + game_id, (number) => {
            setPrepared(true);
            setCount(number);
        });

        socket.on('ready-' + game_id, (matchNo, questions) => {
            changeDisplay(playerNo == 1 ? <Guesser props={props} /> : <Pretender props={{ ...props, questions }} />)
        });
    }, []);

    return (
        <div className={styles.startdialogue}>
            <h1 className={styles.text}>Starting Soon</h1>
            <p className={styles.text}>{startText}</p>
            <p className={styles.text}>{prepared ? `Starting in ${countdown}` : "Preparing game"}</p>
            <p>Good Luck</p>
        </div>
    )
}