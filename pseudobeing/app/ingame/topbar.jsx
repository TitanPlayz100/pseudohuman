import styles from '@/app/styles/startgame.module.css'

export default function PlayerBar() {
    const players = {
        player_1: ['Player 1', 0],
        player_2: ['Player 2', 0]
    }

    return (
        <div className={styles.playersdiv}>
            <p className={styles.playerstext}>{players.player_1[0]} - {players.player_1[1]}</p>
            <p className={styles.vstext}>VS</p>
            <p className={styles.playerstext}>{players.player_2[0]} - {players.player_2[1]}</p>
        </div>
    )
}