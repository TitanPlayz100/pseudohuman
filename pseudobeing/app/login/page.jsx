import styles from '@/app/styles/main.module.css';
export default function loginPage() {
    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>PseudoHuman</h1>
            <p className={styles.loginTextP}>Input a username, or leave blank to be anonymous</p>
            <input className={styles.loginInput} type='text'/>
        </div>
    )
}