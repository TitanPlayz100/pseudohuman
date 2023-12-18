import styles from '@/app/styles/home.module.css'

export default function homepage() {
    return (
        <div className={styles.parentdiv}>
            <div className={styles.info}>
                <h1>Welcome to PseudoHuman</h1>
                <p>You will play in turns with another person to try to catch the human amidst the ai responses. A series of questions will be asked, and if you click the other persons response rather than generated responses, you gain a point. The first to 3 points wins</p>
                <p>You can play with random people or against a friend. </p>
                <h2>Have Fun!</h2>
            </div>
            <div className={styles.buttondiv}>
                <button className={styles.button}>Join Queue</button>
                <button className={styles.button}>Private Game</button>
                <input type='number' max={9999} placeholder='Input code' className={styles.input}></input>
            </div>
        </div>
    )
}