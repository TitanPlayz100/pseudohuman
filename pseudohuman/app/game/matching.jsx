import styles from '@/app/styles/main.module.css'
import dots from '@/app/styles/loadingdots.module.css'
import { useEffect, useState } from 'react'
import Start from './start';
import secureLocalStorage from 'react-secure-storage';

export default function MatchingScreen({ props }) {
    const { socket, changeDisplay, username } = props;
    const [currentState, setCurrentState] = useState('no connection');

    socket.emit('enter-matchmaking', username);

    useEffect(() => {
        socket.on('entered-matching-' + username, () => {
            setCurrentState('connected')
        });
        socket.on('start-' + username, (game_id, playerNo) => {
            setCurrentState('found');
            secureLocalStorage.setItem('game_id', game_id);
            changeDisplay(<Start props={{ ...props, playerNo, game_id }} />);
        });
    }, [])

    function display() {
        switch (currentState) {
            case 'no connection': return <h1 className={styles.loadingtext + " " + dots.loading}>Connecting to Server</h1>
            case 'connected': return <h1 className={styles.loadingtext + " " + dots.loading}>Waiting For Another Player</h1>;
            case 'found': return <h1 className={styles.loadingtext}>Player Found!</h1>;
        }
    }

    return (
        <div className={styles.loginDiv}>
            {display()}
        </div>
    )
}