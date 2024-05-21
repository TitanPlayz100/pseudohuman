import styles from './gameplay.module.css';
import { useEffect, useState } from 'react';
import EndRound from './endround';
import Finish from './finish';
import ProgressBar from '@ramonak/react-progress-bar';

export default function Guesser({ props }) {
    const { socket, changeDisplay, game_id, playerNo, playAudio, music } = props;
    const [waitingText, setWaiting] = useState('Waiting for opponent to answer');
    const [timer, setTimer] = useState(20);
    const [info, setinfo] = useState({ question: 'Loading', answers: ['loading', 'loading', 'loading'] });
    const [timerMax, setMax] = useState(20);

    function selectAnswer(index) {
        const selected = info.answers[index];
        socket.emit('guessed-answer', game_id, playerNo, selected);
        setWaiting('Checking answer...');
        playAudio('select');
    }

    useEffect(() => {
        music.play();

        socket.on('player-answered-' + game_id, (question, answers) => {
            setinfo({ question, answers });
            setWaiting('');
        });

        socket.on('next-round-' + game_id, winner => {
            changeDisplay(<EndRound props={{ ...props, winner }} />);
        });

        socket.on('end-game-' + game_id, (final_winner, amount) => {
            changeDisplay(<Finish props={{ ...props, final_winner, amount }} />);
        });

        socket.on('countdown-' + game_id, (number, max) => {
            if (waitingText != '') return;
            setMax(max);
            setTimer(number);

            if (number == 5) {
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
            <div className={styles.parentdiv} style={{ textAlign: 'center' }}>
                <h1>{info.question}</h1>
                <p>Pick the option that seems most human</p>

                <button
                    className={styles.button}
                    onClick={() => {
                        selectAnswer(0);
                        playAudio('select');
                    }}
                >
                    {info.answers[0]}
                </button>
                <button
                    className={styles.button}
                    onClick={() => {
                        selectAnswer(1);
                        playAudio('select');
                    }}
                >
                    {info.answers[1]}
                </button>
                <button
                    className={styles.button}
                    onClick={() => {
                        selectAnswer(2);
                        playAudio('select');
                    }}
                >
                    {info.answers[2]}
                </button>

                {/* progress bar and timer */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: 'auto',
                        gap: '1vw',
                    }}
                >
                    <p>{timer} seconds</p>
                    <ProgressBar
                        completed={timer}
                        bgColor='#000000'
                        height='1.5vh'
                        width='50vw'
                        borderRadius='0'
                        labelAlignment='center'
                        baseBgColor='#00cc00'
                        labelColor='#0c0c0c'
                        labelSize='1em'
                        transitionDuration='0.4s'
                        transitionTimingFunction='ease'
                        animateOnRender
                        maxCompleted={timerMax}
                        customLabel=' '
                        dir='rtl'
                    />
                </div>
            </div>
        );
    }
}
