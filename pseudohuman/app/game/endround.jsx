import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react';
import Guesser from './guessing';
import Pretender from './pretending';

export default function EndRound({ props }) {
    const { socket, changeDisplay, game_id, playerNo, winner } = props;
    const [countdown, setCount] = useState(5);

    useEffect(() => {
        socket.on('countdown-' + game_id, (number) => {
            setCount(number);
        });

        socket.on('ready-' + game_id, (matchNo, questions) => {
            const isPlayer1 = playerNo == 1;
            const isOddMatch = matchNo % 2 == 1;
            display = isOddMatch ^ isPlayer1 ? <Pretender props={{ ...props, questions }} /> : <Guesser props={props} />

            changeDisplay(display);
        })
    }, []);

    return (
        <div className={styles.parentdiv}>
            <h1 className={styles.text}>{winner} is the winner</h1>
            <h2 className={styles.text}>Next round starting in {countdown}</h2>
        </div>
    )
}