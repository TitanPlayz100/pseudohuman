'use client'

import styles from '@/app/styles/home.module.css'

export function MainMenuButtons() {
    function enterMatching() {
        window.location = '/ingame/matching';
    }

    return (
        <div className={styles.buttondiv}>
            <button className={styles.button} onClick={enterMatching}>Join Queue</button>
            <button className={styles.button} disabled={true}>Private Game</button>
            <input type='text' maxLength={4} placeholder='Input code' className={styles.input} disabled={true}></input>
        </div>
    )
}