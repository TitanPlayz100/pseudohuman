'use client';

import { useEffect, useState } from 'react';
import NavBar from './homepage/navbar/navbar';
import UserInput from './homepage/auth/user';
import { useSearchParams } from 'next/navigation';
import Background from './homepage/background/background';
import styles from './global.module.css';

// Sets the main component to user login page
export default function HomePage() {
    const [display, setDisplay] = useState();
    const [username, setUsername] = useState(null);

    const changeDisplay = display => setDisplay(display);
    const changeUsername = display => setUsername(display);

    // get username from search url to see if user is already playing
    const urlUser = useSearchParams().get('username');

    useEffect(() => {
        setDisplay(<UserInput props={{ username, changeDisplay, changeUsername, urlUser }} />);
    }, []);

    return (
        <>
            {/* matrix inspired background */}
            <Background />

            {/* navbar */}
            <NavBar props={{ username }} />

            {/* main display */}
            <div className={styles.parentParent}>{display}</div>
        </>
    );
}
