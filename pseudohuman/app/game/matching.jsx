import styles from '@/app/styles/main.module.css'
import dots from '@/app/styles/loadingdots.module.css'
import { useEffect, useState } from 'react'
import Start from './start';

export default function MatchingScreen({ props }) {
    const { socket, changeDisplay, username } = props;
    const [startgame, setStartgame] = useState(false);

    function hasFoundPlayer(foundPlayer) {
        if (foundPlayer) {
            return <h1 className={styles.loadingtext}>Player Found!</h1>;
        } else {
            return <h1 className={styles.loadingtext + " " + dots.loading}>Waiting For Another Player</h1>;
        }
    }

    useEffect(() => {
        socket.emit('enter-matchmaking', username);

        socket.on('start-' + username, (game_id, playerNo) => {
            setStartgame(true);
            changeDisplay(<Start props={{ ...props, game_id, playerNo }} />);
        });
    }, [])

    return (
        <div className={styles.loginDiv}>
            {hasFoundPlayer(startgame)}
        </div>
    )
}