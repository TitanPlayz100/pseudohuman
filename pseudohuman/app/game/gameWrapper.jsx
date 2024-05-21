'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import PlayerBar from './navbar/topbar';
import MatchingScreen from './matchmaking/matching';
import styles from './matchmaking/matchmaking.module.css';
import secureLocalStorage from 'react-secure-storage';
import MatchingScreenPrivate from './matchmaking/matchingPrivate';
import { useRouter, useSearchParams } from 'next/navigation';

// server connection
const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

export default function MainPage() {
    const [showBar, setShowBar] = useState(false);
    const [display, setDisplay] = useState(
        <div className={styles.matchingDiv}>
            <h1 className={styles.loadingtext}>Loading</h1>
        </div>
    );

    const changeDisplay = display => setDisplay(display);
    const changeTopbar = bool => setShowBar(bool);
    const isPrivate = useSearchParams().get('private');
    const roomCode = useSearchParams().get('gameid');
    const router = useRouter();
    let music;

    // audio function that other components use
    const playAudio = name => {
        const audio = new Audio('/sfx/' + name + '.mp3');
        audio.volume = 0.1;
        if (name == 'victory') audio.volume = 0.05;
        audio.play();
    };

    // if private game send to private game creation screen
    function changeComponent(username) {
        const newComponent =
            isPrivate == 'true' ? (
                <MatchingScreenPrivate props={{ socket, changeDisplay, username, changeTopbar, playAudio, music }} />
            ) : (
                <MatchingScreen props={{ socket, changeDisplay, username, changeTopbar, roomCode, playAudio, music }} />
            );

        setDisplay(newComponent);
    }

    useEffect(() => {
        // music setup
        music = new Audio('/gameMusic.mp3');
        music.volume = 0.05;
        // get username from localstorage in order to validate it
        const username = secureLocalStorage.getItem('username');

        if (username == null) {
            throw new Error('The username was not saved. Please try logging in again to validate username');
        }

        changeComponent(username);

        // detect other user disconnected
        socket.on('end-game-dc-' + username, () => {
            router.push('/?username=' + username);
            socket.disconnect();
        });

        // Detect disconnect
        window.onbeforeunload = () => {
            secureLocalStorage.removeItem('game_id');
            socket.emit('user-disconnected', username);
        };
    }, []);

    return (
        <>
            {/* only show topbar when game starts */}
            {showBar ? <PlayerBar socket={socket} /> : <></>}
            {display}
        </>
    );
}
