import styles from '@/app/styles/main.module.css'
import dots from '@/app/styles/loadingdots.module.css'
import { useEffect, useState } from 'react'
import Start from './start';
import secureLocalStorage from 'react-secure-storage';

export default function MatchingScreen({ props }) {
    const { socket, changeDisplay, username } = props;
    const [startgame, setStartgame] = useState(false);

    function foundPlayer(foundPlayer) {
        if (socket.connected == false) return <h1 className={styles.loadingtext + " " + dots.loading}>Connecting to Server</h1>;
        if (foundPlayer) return <h1 className={styles.loadingtext}>Player Found!</h1>;
        return <h1 className={styles.loadingtext + " " + dots.loading}>Waiting For Another Player</h1>;
    }

    useEffect(() => {
        socket.emit('enter-matchmaking', username);

        socket.on('start-' + username, (game_id, playerNo) => {
            setStartgame(true);
            secureLocalStorage.setItem('game_id', game_id);
            changeDisplay(<Start props={{ ...props, playerNo, game_id }} />);
        });
    }, [])

    return (
        <div className={styles.loginDiv}>
            {foundPlayer(startgame)}
        </div>
    )
}