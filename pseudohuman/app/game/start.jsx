import styles from '@/app/styles/startgame.module.css'
import { useEffect, useState } from "react";
import Guesser from './guessing';
import Pretender from './pretending';

export default function Start({ props }) {
    const { socket, changeDisplay, game_id, playerNo } = props;

    const [countdown, setCount] = useState(10);
    const starttext = ["You will be guessing the other player's response first", "You will pretend to be an AI first"]

    useEffect(() => {
        socket.on('countdown-' + game_id, (number) => {
            setCount(number);
        });

        socket.on('ready-' + game_id, () => {
            changeDisplay(playerNo == 1 ? <Guesser props={props} /> : <Pretender props={props} />)
        });
    }, []);

    return (
        <div className={styles.startdialogue}>
            <h1 className={styles.text}>Starting Soon</h1>
            <p className={styles.text}>{starttext[playerNo - 1]}</p>
            <p className={styles.text}>Starting in {countdown}</p>
            <p>Good Luck</p>
        </div>
    )
}