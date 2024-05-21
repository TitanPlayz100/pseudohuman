import { useRouter } from 'next/navigation';
import styles from './home.module.css';
import { useEffect, useState } from 'react';

export default function MainMenu({ props }) {
    const { username } = props;
    const [gameid, setGameid] = useState('');
    const [stats, setStats] = useState({ wins: 'loading wins', total_games: 'loading games' });
    const audio = new Audio('/sfx/mmstart.mp3');
    const router = useRouter();

    // function to update the stats
    const displayStats = async () => {
        setStats({
            wins: await getStats('wins'),
            total_games: await getStats('total_games'),
        });
    };

    // fetch stats from the server
    async function getStats(stat) {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/get_stat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, stat }),
            });
            const data = await response.json();
            return `${data.processed} ${stat.replace('_', ' ')}`;
        } catch (error) {
            return 'error';
        }
    }

    async function pressedEnter(event) {
        if (event.key != 'Enter') return;

        // makes sure gameid is 4 characters
        if (gameid.length != 4) return;

        const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/check_room_id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameid }),
        });
        const data = await response.json();
        if (data.valid) {
            router.push('/game?gameid=' + gameid);
        }
    }

    function playSFX() {
        audio.volume = 0.1;
        audio.play();
    }

    function join(isPrivate = false) {
        playSFX();
        if (isPrivate == true) {
            setTimeout(() => router.push('/game?private=true'), 500);
        } else {
            setTimeout(() => router.push('/game'), 500);
        }
    }

    useEffect(() => {
        displayStats();
    }, []);

    return (
        <div className={styles.parentdiv}>
            <div className={styles.info}>
                <h1 className={styles.center}>Welcome to PseudoHuman</h1>
                <p>
                    You will play in turns with another person to try to catch the human amidst the ai responses. A
                    series of questions will be asked, and if you click the other persons response rather than generated
                    responses, you gain a point. The first to 3 points wins
                </p>
                <p>You can play with random people or against a friend. </p>
                <h2>Have Fun!</h2>
                <p style={{ textAlign: 'center', color: 'gray' }}>
                    {username}:<br /> {stats.wins} / {stats.total_games}
                </p>
            </div>
            <div className={styles.buttondiv}>
                <button className={styles.button} onClick={join}>
                    Join Queue
                </button>
                <button className={styles.button} onClick={join.bind(null, true)}>
                    Private Game
                </button>
                <br />
                <input
                    type='text'
                    maxLength={4}
                    placeholder='Room ID'
                    className={styles.input}
                    onChange={event => setGameid(event.target.value)}
                    onKeyDown={pressedEnter}
                    value={gameid}
                />
            </div>
        </div>
    );
}
