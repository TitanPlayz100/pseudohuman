import { useEffect, useState } from "react";
import io from "socket.io-client"
import PlayerBar from "./topbar";
import MatchingScreen from "./matching";
import styles from './startgame.module.css'
import secureLocalStorage from "react-secure-storage";
import MatchingScreenPrivate from "./matchingPrivate";
import { useRouter, useSearchParams } from "next/navigation";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

export default function MainPage() {
    const [display, setDisplay] = useState(<div className={styles.matchingDiv}><h1 className={styles.loadingtext}>Loading</h1></div>);
    const [showBar, setShowBar] = useState(false);

    const changeDisplay = display => setDisplay(display);
    const changeTopbar = bool => setShowBar(bool);
    const isPrivate = useSearchParams().get('private');
    const roomCode = useSearchParams().get('gameid');
    const router = useRouter();
    let music;

    const playAudio = (name) => {
        const audio = new Audio('/sfx/' + name + '.mp3');
        audio.volume = 0.1;
        if (name == 'victory') audio.volume = 0.05;
        audio.play();
    }

    // check user interaction
    useEffect(() => {
        music = new Audio('/gameMusic.mp3');
        music.volume = 0.05;
    }, []);

    function changeComponent(username) {
        // if private game send to private game creation screen
        if (isPrivate == 'true') {
            setDisplay(<MatchingScreenPrivate props={{ socket, changeDisplay, username, changeTopbar, playAudio, music }} />);
            return;
        }

        setDisplay(<MatchingScreen props={{ socket, changeDisplay, username, changeTopbar, roomCode, playAudio, music }} />)
    }

    useEffect(() => {
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
        }
    }, []);

    return (
        <>
            {/* only show topbar when game starts */}
            {showBar ? <PlayerBar socket={socket} /> : <></>}
            {display}
        </>
    )

}