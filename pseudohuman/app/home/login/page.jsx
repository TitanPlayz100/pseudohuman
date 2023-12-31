import styles from '@/app/styles/main.module.css';
import { UsernameInput } from '@/app/components/UsernameInput';

export default function loginPage() {
    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Welcome</h1>
            <p className={styles.loginTextP}>Input a username, or leave blank to be anonymous. Press ENTER to continue</p>
            <UsernameInput/>
        </div>
    )
}