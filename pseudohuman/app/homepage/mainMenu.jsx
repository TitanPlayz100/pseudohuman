import styles from '@/app/styles/home.module.css'
import { useEffect, useState } from 'react';

export default function MainMenu({ props }) {
    const { username } = props;
    const [stats, setStats] = useState({ wins: 0, total_games: 0 });

    async function getStats(stat) {
        const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/get_stat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ username, stat }),
        });
        const data = await response.json();
        return data.processed;
    }

    useEffect(() => {
        const test = (async () => {
            setStats({
                wins: await getStats('wins'),
                total_games: await getStats('total_games'),
            })
        })
        test();
    }, []);

    return (
        <div className={styles.parentdiv}>
            <div className={styles.info}>
                <h1>Welcome to PseudoHuman</h1>
                <p>You will play in turns with another person to try to catch the human amidst the ai responses. A series of questions will be asked, and if you click the other persons response rather than generated responses, you gain a point. The first to 3 points wins</p>
                <p>You can play with random people or against a friend. </p>
                <h2>Have Fun!</h2>
                <p>{username}'s stats<br /> {stats.wins} wins / {stats.total_games} games</p>
            </div>
            <div className={styles.buttondiv}>
                <button className={styles.button} onClick={() => window.location = '/game'}>Join Queue</button>
                <button className={styles.button} disabled={true}>Private Game</button>
                <input type='text' maxLength={4} placeholder='Input code' className={styles.input} disabled={true}></input>
            </div>
        </div>
    )
}