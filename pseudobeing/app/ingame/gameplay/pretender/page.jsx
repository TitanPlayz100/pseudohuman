'use client'

import styles from '@/app/styles/gameplay.module.css'
import { useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

export default function Start() {
    const [inputText, setText] = useState("");
    const [delayedText, setDelayedText] = useState("");
    const [waiting, setWaiting] = useState(false);
    const info = {
        question: "Example Question?",
        generated: [
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et, magnam mollitia ad dolor, illo quia modi debitis praesentium cum deserunt autem necessitatibus cupiditate quis ea dolorem itaque ipsa quam tenetur?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, debitis similique, molestiae ratione voluptate eveniet asperiores, sunt itaque nisi tempora dignissimos nemo veniam. Exercitationem animi, quidem soluta excepturi quia praesentium!"
        ]
    };

    const handleChange = (event) => {
        setText(event.target.value);
    }

    function submitAnswer() {
        setDelayedText(inputText);
        setWaiting(true);
    }


    if (!waiting) {
        return (
            <div className={styles.parentdiv}>
                <h1>Question: {info.question}</h1>
                <p>Write an answer, and make it appear like ChatGPT wrote it</p>

                {/* ai generated responses */}
                <Accordion className={styles.accordian}>
                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                        <span>&gt; AI Response 1 </span>
                        <span className={styles.accordianheading}> (click to expand)</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        {info.generated[0]}
                    </AccordionDetails>
                </Accordion>
                <p></p>
                <Accordion className={styles.accordian}>
                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                        <span>&gt; AI Response 2 </span>
                        <span className={styles.accordianheading}> (click to expand)</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        {info.generated[1]}
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
                <p>{delayedText}</p>
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