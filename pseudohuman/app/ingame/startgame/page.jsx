import { IntroText } from '@/app/components/StartText'
import styles from '@/app/styles/startgame.module.css'

export default function Start() {
    return (
        <div className={styles.startdialogue}>
            <h1 className={styles.text}>Starting Soon</h1>
            <IntroText/>
            <p>Good Luck</p>
        </div>
    )
}