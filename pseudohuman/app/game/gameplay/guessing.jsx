import styles from './gameplay.module.css';
import { useEffect, useState } from 'react';
import EndRound from './endround';
import Finish from './finish';
import TimerBar from './timerProgress';

export default function Guesser({ props }) {
    const { socket, changeDisplay, game_id, playerNo, playAudio, music } = props;
    const [waitingText, setWaiting] = useState('Waiting for opponent to answer');
    const [timer, setTimer] = useState(20);
    const [info, setinfo] = useState({ question: 'Loading', answers: ['loading', 'loading', 'loading'] });
    const [timerMax, setMax] = useState(20);

    // presses an option
    function selectAnswer(index) {
        const selected = info.answers[index];
        socket.emit('guessed-answer', game_id, playerNo, selected);
        setWaiting('Checking answer...');
        playAudio('select');
    }

    useEffect(() => {
        music.play();

        // detect when other player answered
        socket.on('player-answered-' + game_id, (question, answers) => {
            setinfo({ question, answers });
            setWaiting('');
            playAudio('select');
        });

        socket.on('next-round-' + game_id, winner => {
            changeDisplay(<EndRound props={{ ...props, winner }} />);
        });

        socket.on('end-game-' + game_id, (final_winner, amount) => {
            changeDisplay(<Finish props={{ ...props, final_winner, amount }} />);
        });

        // change countdown bar
        socket.on('countdown-' + game_id, (number, max) => {
            if (waitingText != '') return;
            setMax(max);
            setTimer(number);

            if (number == 6) {
                playAudio('hyperalert');
            }
        });
    }, [waitingText]);

    if (waitingText) {
        // text for waiting for opponent to answer
        return (
            <div className={styles.parentdiv} style={{ textAlign: 'center' }}>
                <h1 className={styles.text}>{waitingText}</h1>
                <p className={styles.text}>Do you have what it takes?</p>
            </div>
        );
    } else {
        // select options for the answer
        return (
            <div
                className={styles.parentdiv + (timer <= 5 ? ' ' + styles.parentdivdanger : '')}
                style={{ textAlign: 'center' }}
            >
                <h1>{info.question}</h1>
                <p>Pick the option that seems most human</p>

                {/* options mapped out */}
                {info.answers.map((answer, index) => {
                    return (
                        <button
                            className={styles.button + (timer <= 5 ? ' ' + styles.buttondanger : '')}
                            onClick={() => selectAnswer(index)}
                        >
                            {answer}
                        </button>
                    );
                })}

                {/* timer */}
                <TimerBar timer={timer} timerMax={timerMax} />
            </div>
        );
    }
}
