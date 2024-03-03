import styles from '@/app/styles/gameplay.module.css'
import { useEffect, useState } from 'react';

export default function Finish({ props }) {
    const { socket, username, game_id } = props;
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState('');

    socket.emit('get-results', game_id, username);

    function calcPoints(points) {
        return (points[0] > points[1]) ?
            points[0] - points[1] :
            points[1] - points[0]
    }

    async function sendMain() {
        setLoading('Loading');
        if (username == results.winner) {
            setLoading('Adding result to database');
            await fetch("/api/change_points", { method: 'POST', body: JSON.stringify({ username, amount: 1 }) });
        }
        window.location = '/?username=' + username;
        socket.disconnect();
    }

    useEffect(() => {
        socket.on('got-results-' + game_id, (info) => {
            const winner = (info.winner == 'player1') ? info.player1.username : info.player2.username;
            const points = [info.player1.points, info.player2.points]
            const wonBy = calcPoints(points);
            setResults({ winner, points, wonBy })
        });
    }, []);

    return (
        <div className={styles.parentdiv}>
            <h1 className={styles.text}>{results.winner} is the winner</h1>
            <h2 className={styles.text}>They won by {results.wonBy} points</h2>
            <button className={styles.submit} onClick={sendMain}>Main Menu</button>
            <p>{loading}</p>
        </div>
    )
}