import styles from './matchmaking.module.css';
import spinner from './loadingspinner.module.css';
import { useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/navigation';
import Start from '../gameplay/start';

export default function MatchingScreen({ props }) {
    const { socket, changeDisplay, username, changeTopbar, roomCode } = props;
    const [currentState, setCurrentState] = useState('no connection');
    const router = useRouter();

    useEffect(() => {
        socket.emit('enter-matchmaking', username, roomCode);

        socket.on('entered-matching-' + username, () => {
            setCurrentState('connected');
        });
        socket.on('start-' + username, (game_id, playerNo, startText) => {
            setCurrentState('found');
            changeTopbar(true);
            secureLocalStorage.setItem('game_id', game_id);
            changeDisplay(<Start props={{ ...props, playerNo, game_id, startText }} />);
        });
    }, []);

    // change text based on status of server
    function display() {
        switch (currentState) {
            case 'no connection':
                return (
                    <>
                        <h1 className={styles.loadingtext}>Connecting to Server</h1>
                        <div className={spinner.loader}></div>
                    </>
                );
            case 'connected':
                return (
                    <>
                        <h1 className={styles.loadingtext}>Waiting for Another Player</h1>
                        <div className={spinner.loader}></div>
                    </>
                );
            case 'found':
                return <h1 className={styles.loadingtext}>Player Found!</h1>;
        }
    }

    return (
        <div className={styles.matchingDiv}>
            {display()}
            <button className={styles.button} onClick={() => router.push('/?username=' + username, { scroll: false })}>
                Leave
            </button>
        </div>
    );
}
