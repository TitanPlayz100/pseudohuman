import styles from './gameplay.module.css';
import { useEffect, useState } from 'react';
import EndRound from './endround';
import Finish from './finish';
import SimilarityEngine from '@roxon3000/text-similarity';
import { replaceProfanities } from 'no-profanity';
import TimerBar from './timerProgress';

export default function Pretender({ props }) {
    const { socket, changeDisplay, game_id, questions, playAudio, music } = props;
    const [inputText, setText] = useState('');
    const [waiting, setWaiting] = useState(false);
    const [timer, setTimer] = useState(45);
    const [timerMax, setMax] = useState(45);
    const [similarityScore, setSimilarity] = useState(0);
    const sc = new SimilarityEngine();

    const handleChange = event => {
        setText(event.target.value);
        checkSimilarity();
    };

    // checks the similarity between input and the answers
    // uses a custom library
    function checkSimilarity() {
        if (inputText == '') return 0;
        const check1 = sc.getSimilarityScore(inputText + ' ', questions.answers[0]);
        const check2 = sc.getSimilarityScore(inputText + ' ', questions.answers[1]);
        setSimilarity(check1 > check2 ? check1 : check2);
        return check1 > check2 ? check1 : check2;
    }

    // ensures that input is below threshold of similarity which is 75%
    function submitAnswer() {
        if (checkSimilarity() > 75) return;

        // replaces profane words with ***
        const inputTextclean = replaceProfanities(inputText);

        socket.emit('send-player-answer', game_id, inputTextclean, timer);
        setWaiting(true);

        playAudio('select');
    }

    useEffect(() => {
        music.play();

        socket.on('next-round-' + game_id, (winner, amount) => {
            changeDisplay(<EndRound props={{ ...props, winner, pointsGained: amount }} />);
        });

        socket.on('end-game-' + game_id, (final_winner, amount) => {
            changeDisplay(<Finish props={{ ...props, final_winner, amount }} />);
        });

        socket.on('countdown-' + game_id, (number, maxNo) => {
            if (waiting) return;
            setMax(maxNo);
            setTimer(number);

            if (number == 6) {
                playAudio('hyperalert');
            }
        });
    }, []);

    if (!waiting) {
        return (
            // answering box
            <div className={styles.parentdiv + (timer <= 5 ? ' ' + styles.parentdivdanger : '')}>
                <h1 className={styles.h1}>{questions.question}</h1>
                <p>Write an answer, and make it appear like an AI wrote it</p>

                {/* ai generated responses */}
                <h3 style={{ textAlign: 'center' }}>AI Answer 1</h3>
                <p>{questions.answers[0]}</p>

                <h3 style={{ textAlign: 'center' }}>AI Answer 2</h3>
                <p>{questions.answers[1]}</p>

                {/* user input */}
                <input
                    className={similarityScore > 75 || timer <= 5 ? styles.inputwarn : styles.input}
                    type='text'
                    placeholder='Input text (max 150)'
                    maxLength={150}
                    onChange={handleChange}
                />

                <center>
                    {/* similarity score display */}
                    <p className={styles.textwarn} style={{ opacity: similarityScore > 75 ? 1 : 0 }}>
                        Answer too similar: {similarityScore}%
                    </p>

                    {/* submit button */}
                    <button
                        className={styles.submit + (timer <= 5 ? ' ' + styles.submitdanger : '')}
                        onClick={submitAnswer}
                    >
                        Submit Answer
                    </button>
                </center>

                {/* timer */}
                <TimerBar timer={timer} timerMax={timerMax} />
            </div>
        );
    } else {
        // waiting text
        return (
            <div className={styles.parentdiv} style={{ textAlign: 'center' }}>
                <h1 className={styles.text}>Waiting for other player's choice</h1>
                <p className={styles.text}>Do you think you will fool them?</p>
            </div>
        );
    }
}
