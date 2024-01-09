import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react'
import EndRound from './endround';
import Finish from './finish';

export default function Pretender({ props }) {
    const { socket, changeDisplay, game_id } = props;
    const [inputText, setText] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [info, setinfo] = useState({ question: "Loading", answers: ["loading", "loading"] });
    const handleChange = (event) => { setText(event.target.value); }

    socket.emit('get-question', game_id);

    function submitAnswer() {
        socket.emit('send-player-answer', game_id, inputText)
        setWaiting(true);
    }

    useEffect(() => {
        socket.on('return-question-' + game_id, (infoobj) => {
            setinfo({ question: infoobj.question, answers: infoobj.answers });
        });

        socket.on('next-round-' + game_id, () => {
            changeDisplay(<EndRound props={props} />)
        });

        socket.on('end-game-' + game_id, () => {
            changeDisplay(<Finish props={props} />)
        });
    }, []);

    if (!waiting) {
        return (
            <div className={styles.parentdiv}>
                <h1>{info.question}</h1>
                <p>Write an answer, and make it appear like ChatGPT wrote it</p>

                {/* ai generated responses */}
                <h3>AI Answer 1</h3>
                <p>{info.answers[0]}</p>

                <h3>AI Answer 2</h3>
                <p>{info.answers[1]}</p>

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