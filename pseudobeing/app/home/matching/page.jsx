import styles from '@/app/styles/main.module.css'
import dots from '@/app/styles/loadingdots.module.css'

function hasFoundPlayer(foundPlayer) {
    if (foundPlayer == true) {
        return <h1 className={styles.loadingtext}>Player Found!</h1>;
    } else {
        return <h1 className={styles.loadingtext + " " + dots.loading}>Waiting For Another Player</h1>;
    }
}

export default function Matching() {
    // If player is found then change "false" to "true"
    return (
        <div className={styles.loginDiv}>
            {hasFoundPlayer(false)} 
        </div>
    )
}