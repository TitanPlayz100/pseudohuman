import { useEffect } from 'react';
import styles from './gameplay.module.css'
import { useRouter } from 'next/navigation';

export default function Finish({ props }) {
    const { username, final_winner, amount, music, playAudio } = props;
    const router = useRouter();

    useEffect(() => {
        music.pause();
        music.currentTime = 0;
        playAudio('victory');
    }, [])

    return (
        <div className={styles.parentdiv} style={{ textAlign: 'center' }}>
            <h1 className={styles.text}>{final_winner} is the winner</h1>
            <h2 className={styles.text}>They won by {amount} points</h2>
            <button className={styles.submit} onClick={() => router.push('/?username=' + username)}>Main Menu</button>
        </div>
    )
}