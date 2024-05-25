import styles from './matchmaking.module.css';
import spinner from './loadingspinner.module.css';
import { useEffect, useRef, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import Start from '../gameplay/start';

export default function MatchingScreenPrivate({ props }) {
    const { socket, changeDisplay, username, changeTopbar } = props;
    const [currentState, setCurrentState] = useState('no connection');
    const [gameID, setGameID] = useState('Private Game');
    const waitingMusic = useRef(new Audio('/waiting.mp3'));

    useEffect(() => {
        waitingMusic.current.volume = 0.02;
        let timeout = -1;

        function playmusic() {
            waitingMusic.current.currentTime = 0;
            waitingMusic.current.play();
            timeout = setTimeout(() => playmusic(), waitingMusic.current.duration * 1000);
        }

        playmusic();

        socket.emit('enter-matchmaking-private', username);

        socket.on('entered-matching-private-' + username, game_id => {
            setCurrentState('connected');
            setGameID(`Game ID: ${game_id}`);
        });

        socket.on('already-ingame-' + username, () => (window.location = '/?username=' + username));

        socket.on('start-' + username, (game_id, playerNo, startText) => {
            waitingMusic.current.pause();
            clearTimeout(timeout);
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
            <h2 className={styles.subtext}>{gameID}</h2>
            {display()}
            <button className={styles.button} onClick={() => (window.location = '/?username=' + username)}>
                Leave
            </button>
        </div>
    );
}
