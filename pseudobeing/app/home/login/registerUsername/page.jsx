import styles from '@/app/styles/main.module.css';
import { RegisterUsername } from '@/app/components/RegisterInput';

export default function Password() {
    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTextHeader}>Register</h1>
            <p className={styles.loginTextP}>Input your new password. Press ENTER to continue</p>
            <RegisterUsername/>
        </div>
    )

}