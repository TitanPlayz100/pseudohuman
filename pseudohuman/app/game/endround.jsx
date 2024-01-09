import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react';
import Guesser from './guessing';
import Pretender from './pretending';

export default function EndRound({ props }) {
    const { socket, changeDisplay, game_id, playerNo } = props;
    const [winner, setWinner] = useState("");
    const [countdown, setCount] = useState(5);

    socket.emit('get-current-winner', game_id);

    useEffect(() => {
        socket.on('countdown-' + game_id, (number) => {
            setCount(number);
        });

        socket.on('got-current-winner-' + game_id, (player) => {
            setWinner(player);
        });

        socket.on('ready-' + game_id, (matchNo) => {
            let display = null;
            if (matchNo % 2 == 1) {
                display = (playerNo == 1) ? <Guesser props={props} /> : <Pretender props={props} />
            } else {
                display = (playerNo == 2) ? <Guesser props={props} /> : <Pretender props={props} />
            }
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