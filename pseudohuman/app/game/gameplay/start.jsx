import styles from './start.module.css';
import { useEffect, useState } from 'react';
import Guesser from './guessing';
import Pretender from './pretending';
import NowPlaying from '../matchmaking/nowPlaying';

export default function Start({ props }) {
    const { socket, changeDisplay, game_id, playerNo, startText } = props;
    const [countdown, setCount] = useState(5);
    const [prepared, setPrepared] = useState(false);

    useEffect(() => {
        socket.on('countdown-' + game_id, number => {
            setPrepared(true);
            setCount(number);
        });

        socket.on('ready-' + game_id, (matchNo, questions, p1_abilities, p2_abilities) => {
            // if player 1, then they are pretender
            changeDisplay(
                playerNo == 1 ? (
                    <Guesser props={{ ...props, abilityCount: p1_abilities }} />
                ) : (
                    <Pretender props={{ ...props, questions, abilityCount: p2_abilities }} />
                )
            );
        });
    }, []);

    return (
        <>
            <div className={styles.startdialogue}>
                <h1 className={styles.text}>Starting Soon</h1>
                <p className={styles.text}>{startText}</p>
                <p className={styles.text}>{prepared ? `Starting in ${countdown}` : 'Preparing game'}</p>
                <p>Good Luck</p>
            </div>
            <NowPlaying text='Lobby Music 80s Edition - Kahoot!' />
        </>
    );
}
