'use client'

import styles from '@/app/styles/gameplay.module.css'
import { useState } from 'react'

export default function Start() {
    const [displayText, setText] = useState("");
    const info = {
        question: "Example Question?",
        answers: [
            "Answer 1",
            "Answer 2",
            "Answer 3"
        ],
        correct: 1
    };

    function selectAnswer(answer) {
        setText((answer == info.correct) ? "Correct" : "Wrong")
    }

    const isWaiting = false;
    if (isWaiting) {
        // text for waiting for opponent to answer
        return (
            <div className={styles.parentdiv}>
                <h1 className={styles.text}>Waiting for other player's answer</h1>
                <p className={styles.text}>Do you have what it takes?</p>
            </div>
        )
    }

    else {
        // select options for the answer
        return (
            <div className={styles.parentdiv}>
                <h1>Question: {info.question}</h1>
                <p>Pick the option that seems most human</p>
                <button className={styles.button} onClick={() => selectAnswer(1)}>{info.answers[0]}</button>
                <button className={styles.button} onClick={() => selectAnswer(2)}>{info.answers[1]}</button>
                <button className={styles.button} onClick={() => selectAnswer(3)}>{info.answers[2]}</button>
                <p>{displayText}</p>
            </div>
        )
    }
}