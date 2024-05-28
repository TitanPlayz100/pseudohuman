import styles from './gameplay.module.css';
import { useEffect, useState } from 'react';
import Guesser from './guessing';
import Pretender from './pretending';

export default function EndRound({ props }) {
    const { socket, changeDisplay, game_id, playerNo, winner, pointsGained, playAudio, username, music } = props;
    const [countdown, setCount] = useState(5);

    useEffect(() => {
        // audio
        music.pause();
        music.currentTime = 0;

        if (winner == username) {
            playAudio('showscore');
        } else {
            playAudio('lose');
        }

        socket.on('countdown-' + game_id, number => {
            setCount(number);
        });

        socket.on('ready-' + game_id, (matchNo, questions) => {
            const isPlayer1 = playerNo == 1;
            const isOddMatch = matchNo % 2 == 1;

            // if the match number is odd, then player 1 is the pretender
            // if the match number is even, then player 2 is the pretender
            const display =
                isOddMatch ^ isPlayer1 ? <Pretender props={{ ...props, questions }} /> : <Guesser props={props} />;

            changeDisplay(display);
        });
    }, []);

    return (
        <div className={styles.parentdiv} style={{ textAlign: 'center' }}>
            <h1 className={styles.text}>{winner} is the winner</h1>
            <p className={styles.text}>They gained ${pointsGained}</p>
            <h2 className={styles.text}>Next round starting in {countdown}</h2>
        </div>
    );
}
