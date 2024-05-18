import styles from './navbar.module.css'
import secureLocalStorage from 'react-secure-storage'

export function LogoutButton({ props }) {
    return (
        <button
            className={styles.Button + " " + styles.loginbutton}
            onClick={() => {
                secureLocalStorage.clear();
                window.location.reload();
            }}>
            {props.username == null ? 'Login' : 'Logout'}
        </button>
    )
}