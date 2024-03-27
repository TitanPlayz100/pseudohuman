import styles from '@/app/styles/gameplay.module.css'

export default function Finish({ props }) {
    const { username, final_winner, amount } = props;

    async function sendMain() {
        window.location = '/?username=' + username;
    }

    return (
        <div className={styles.parentdiv}>
            <h1 className={styles.text}>{final_winner} is the winner</h1>
            <h2 className={styles.text}>They won by {amount} points</h2>
            <button className={styles.submit} onClick={sendMain}>Main Menu</button>
        </div>
    )
}