import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react'
import EndRound from './endround';
import Finish from './finish';
import SimilarityEngine from '@roxon3000/text-similarity';

export default function Pretender({ props }) {
    const { socket, changeDisplay, game_id, questions, playerNo } = props;

    const [inputText, setText] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [timer, setTimer] = useState(10);
    const [similarityScore, setSimilarity] = useState(0);
    const sc = new SimilarityEngine();

    const handleChange = (event) => {
        setText(event.target.value);
        checkSimilarity();
    }

    function checkSimilarity() {
        const check1 = sc.getSimilarityScore(inputText + " ", questions.answers[0])
        const check2 = sc.getSimilarityScore(inputText + " ", questions.answers[1])
        setSimilarity(check1 > check2 ? check1 : check2)
        return check1 > check2 ? check1 : check2
    }

    function submitAnswer() {
        if (checkSimilarity() > 75) return;
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

        socket.on('countdown-' + game_id, (number) => {
            if (waiting) return;
            setTimer(number);
        });
    }, []);

    if (!waiting) {
        return (
            // answering box
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
                    className={similarityScore > 75 ? styles.inputwarn : styles.input}
                    type='text'
                    placeholder='Input text (max 150)'
                    maxLength={150}
                    onChange={handleChange}
                />
                <p className={styles.textwarn} style={{ opacity: similarityScore > 75 ? 1 : 0 }}>Answer too similar: {similarityScore}%</p>

                <button className={styles.submit} onClick={submitAnswer}>Submit Answer</button>

                <p>{timer} seconds left</p>
            </div>
        )
    }
    else {
        // waiting text
        return (
            <div className={styles.parentdiv}>
                <h1 className={styles.text}>Waiting for other player's choice</h1>
                <p className={styles.text}>Do you think you will fool them?</p>
            </div>
        )
    }

}