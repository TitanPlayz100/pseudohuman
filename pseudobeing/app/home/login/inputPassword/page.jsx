import styles from '@/app/styles/main.module.css';
import { PasswordInput } from '@/app/components/PasswordInput';

export default function Password() {
    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Password</h1>
            <p className={styles.loginTextP}>Input your Password. Press ENTER to continue</p>
            <PasswordInput/>
        </div>
    )
}