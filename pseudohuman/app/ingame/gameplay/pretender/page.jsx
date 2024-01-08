'use client'

import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react'
import { io } from "socket.io-client"
import { useRouter } from 'next/navigation';
import url from '../../http';

const socket = io(url());

export default function Start() {
    const [inputText, setText] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [info, setinfo] = useState({ question: "Loading", answers: ["loading", "loading"] });
    const router = useRouter();

    const handleChange = (event) => {
        setText(event.target.value);
    }

    function submitAnswer() {
        const input = inputText;
        const gameid = localStorage.getItem('game_id');
        socket.emit('send-player-answer', { gameid, input })
        setWaiting(true);
    }

    useEffect(() => {
        const gameid = localStorage.getItem('game_id');
        socket.emit('get-question', gameid);

        socket.on('return-question-' + gameid, (infoobj) => {
            setinfo({
                question: infoobj.question,
                answers: infoobj.answers
            });
        });

        socket.on('next-round-' + gameid, () => {
            router.push('/ingame/result');
        });

        socket.on('end-game-' + gameid, () => {
            router.push('/ingame/finish');
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