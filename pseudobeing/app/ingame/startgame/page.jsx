import styles from '@/app/styles/startgame.module.css'

export default function Start() {
    const isPlayer1 = true;
    const starttext = isPlayer1 ?
        "You will be guessing the player's response first, then on the next round you will pretend to be an AI":
        "You will pretend to be an AI first, then in the next round you will be guessing the player's response";


    return (
        <div className={styles.startdialogue}>
            <h1 className={styles.text}>Starting Soon</h1>
            <p className={styles.text}>{starttext}</p>
            <p>Good Luck</p>
        </div>
    )
}