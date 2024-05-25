import styles from './navbar.module.css';
import Image from 'next/image';
import { LogoutButton } from './LoggedUserButton';

export default function NavBar({ props }) {
    return (
        <div className={styles.parentDiv}>
            <ul className={styles.ul}>
                <li className={styles.li}>
                    {/* icon */}
                    <Image width={0} height={0} src='/cyborg.svg' alt='logo' className={styles.image} priority />
                </li>
                <li className={styles.li}>
                    <span className={styles.litext}>PseudoHuman</span>
                </li>
            </ul>
            <ul className={styles.ul}>
                <li className={styles.li}>
                    {/* logout component */}
                    <LogoutButton props={props} />
                </li>
            </ul>
        </div>
    );
}
