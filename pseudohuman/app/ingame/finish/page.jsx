import styles from '@/app/styles/gameplay.module.css'
import Link from 'next/link';

export default function Start() {
    const points = {
        winner: 1,
        point: {
            player1: 3,
            player2: 2
        }
    }

    let won_by = 0;

    if (points.point.player1 > points.point.player2) {
        won_by = points.point.player1 - points.point.player2;
    } else {
        won_by = - points.point.player1 + points.point.player2;
    }

    return (
        <div className={styles.parentdiv}>
            <h1 className={styles.text}>Player {points.winner} is the winner</h1>
            <h2 className={styles.text}>They won by {won_by} points</h2>
            <Link href='/home/mainmenu'><button className={styles.submit}>Main Menu</button></Link>
        </div>
    )
}