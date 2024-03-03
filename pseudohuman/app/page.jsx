'use client'

import { useEffect, useState } from "react"
import NavBar from "./homepage/navbar"
import UserInput from "./homepage/user";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
    const [display, setDisplay] = useState();
    const [username, setUsername] = useState(null);
    const changeDisplay = (display) => {
        setDisplay(display)
    };
    const changeUsername = (display) => {
        setUsername(display)
    };
    const urlUser = useSearchParams().get('username');

    useEffect(() => {
        setDisplay(<UserInput props={{ username, changeDisplay, changeUsername, urlUser }} />)
    }, [])

    return (
        <>
            <NavBar props={{ username }} />
            {display}
        </>
    )
}