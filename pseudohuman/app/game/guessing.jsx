import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react'
import EndRound from './endround';
import Finish from './finish';

export default function Guesser({ props }) {
    const { socket, changeDisplay, game_id, playerNo } = props;
    const [isWaiting, setWaiting] = useState(true);
    const [info, setinfo] = useState({ question: "Loading", answers: ["loading", "loading", "loading"], correct: -1 });

    function selectAnswer(answer) {
        const isCorrect = answer == info.correct;
        socket.emit('guessed-answer', game_id, playerNo, isCorrect);
    }

    useEffect(() => {
        socket.on('player-answered-' + game_id, (currentGame) => {
            setinfo({
                question: currentGame.question,
                answers: currentGame.answers,
                correct: currentGame.correctanswer
            });
            setWaiting(false);
        });

        socket.on('next-round-' + game_id, () => {
            changeDisplay(<EndRound props={props} />)
        });

        socket.on('end-game-' + game_id, () => {
            changeDisplay(<Finish props={props} />)
        });
    }, []);

    if (isWaiting) {
        // text for waiting for opponent to answer
        return (
            <div className={styles.parentdiv}>
                <h1 className={styles.text}>Waiting for other player's answer</h1>
                <p className={styles.text}>Do you have what it takes?</p>
            </div>
        )
    } else {
        // select options for the answer
        return (
            <div className={styles.parentdiv}>
                <h1>{info.question}</h1>
                <p>Pick the option that seems most human</p>
                <button className={styles.button} onClick={() => selectAnswer(1)}>{info.answers[0]}</button>
                <button className={styles.button} onClick={() => selectAnswer(2)}>{info.answers[1]}</button>
                <button className={styles.button} onClick={() => selectAnswer(3)}>{info.answers[2]}</button>
            </div>
        )
    }
}