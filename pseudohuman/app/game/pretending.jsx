import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react'
import EndRound from './endround';
import Finish from './finish';

export default function Pretender({ props }) {
    const { socket, changeDisplay, game_id, questions } = props;
    const [inputText, setText] = useState("");
    const [waiting, setWaiting] = useState(false);
    const handleChange = (event) => { setText(event.target.value); }

    function submitAnswer() {
        socket.emit('send-player-answer', game_id, inputText)
        setWaiting(true);
    }

    useEffect(() => {
        socket.on('next-round-' + game_id, (winner) => {
            changeDisplay(<EndRound props={{ ...props, winner }} />)
        });

        socket.on('end-game-' + game_id, (final_winner, amount) => {
            changeDisplay(<Finish props={{ ...props, final_winner, amount }} />)
        });
    }, []);

    if (!waiting) {
        return (
            <div className={styles.parentdiv}>
                <h1>{questions.question}</h1>
                <p>Write an answer, and make it appear like ChatGPT wrote it</p>

                {/* ai generated responses */}
                <h3>AI Answer 1</h3>
                <p>{questions.answers[0]}</p>

                <h3>AI Answer 2</h3>
                <p>{questions.answers[1]}</p>

                {/* user input */}
                <input
                    className={styles.input}
                    type='text'
                    placeholder='Input text (max 100)'
                    maxLength={100}
                    onChange={handleChange}
                />
                <button className={styles.submit} onClick={submitAnswer}>Submit Answer</button>
            </div>
        )
    }
    else {
        return (
            <div className={styles.parentdiv}>
                <h1 className={styles.text}>Waiting for other player's choice</h1>
                <p className={styles.text}>Do you think you will fool them?</p>
            </div>
        )
    }

}