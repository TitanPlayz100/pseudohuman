'use client'

import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { io } from "socket.io-client"

const socket = io('http://localhost:3001');

export default function Start() {
    const [inputText, setText] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [info, setinfo] = useState({ question: "Loading", answers: ["loading", "loading"] });

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
            window.location = '/ingame/result';
        });

        socket.on('end-game-' + gameid, () => {
            window.location = '/ingame/finish';
        });
    }, []);

    if (!waiting) {
        return (
            <div className={styles.parentdiv}>
                <h1>{info.question}</h1>
                <p>Write an answer, and make it appear like ChatGPT wrote it</p>

                {/* ai generated responses */}
                <Accordion className={styles.accordian}>
                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                        <span>&gt; AI Response 1 </span>
                        <span className={styles.accordianheading}> (click to expand)</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        {info.answers[0]}
                    </AccordionDetails>
                </Accordion>
                <p></p>
                <Accordion className={styles.accordian}>
                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                        <span>&gt; AI Response 2 </span>
                        <span className={styles.accordianheading}> (click to expand)</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        {info.answers[1]}
                    </AccordionDetails>
                </Accordion>

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