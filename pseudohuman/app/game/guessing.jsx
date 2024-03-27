import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react'
import EndRound from './endround';
import Finish from './finish';

export default function Guesser({ props }) {
    const { socket, changeDisplay, game_id, playerNo } = props;
    const [waitingText, setWaiting] = useState("Waiting for opponent to answer");
    const [info, setinfo] = useState({ question: "Loading", answers: ["loading", "loading", "loading"] });

    function selectAnswer(index) {
        const selected = info.answers[index];
        socket.emit('guessed-answer', game_id, playerNo, selected);
        setWaiting("Checking answer...");
    }

    useEffect(() => {
        socket.on('player-answered-' + game_id, (question, answers) => {
            setinfo({ question, answers });
            setWaiting('');
        });

        socket.on('next-round-' + game_id, (winner) => {
            changeDisplay(<EndRound props={{ ...props, winner }} />)
        });

        socket.on('end-game-' + game_id, (final_winner, amount) => {
            changeDisplay(<Finish props={{ ...props, final_winner, amount }} />)
        });
    }, []);

    if (waitingText) {
        // text for waiting for opponent to answer
        return (
            <div className={styles.parentdiv}>
                <h1 className={styles.text}>{waitingText}</h1>
                <p className={styles.text}>Do you have what it takes?</p>
            </div>
        )
    } else {
        // select options for the answer
        return (
            <div className={styles.parentdiv}>
                <h1>{info.question}</h1>
                <p>Pick the option that seems most human</p>
                <button className={styles.button} onClick={() => selectAnswer(0)}>{info.answers[0]}</button>
                <button className={styles.button} onClick={() => selectAnswer(1)}>{info.answers[1]}</button>
                <button className={styles.button} onClick={() => selectAnswer(2)}>{info.answers[2]}</button>
            </div>
        )
    }
}