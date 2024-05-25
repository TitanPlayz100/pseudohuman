import styles from './navbar.module.css';
import secureLocalStorage from 'react-secure-storage';

export function LogoutButton({ props }) {
    return (
        <button
            className={styles.Button + ' ' + styles.loginbutton}
            onClick={() => {
                // remove username from localstorage and reload to send to login page
                secureLocalStorage.clear();
                window.location.reload();
            }}
        >
            {props.username == null ? 'Login' : 'Logout'}
        </button>
    );
}
