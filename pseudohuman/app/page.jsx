'use client'
import { useEffect } from "react";
export default function Home() {
    useEffect(() => {
        if (localStorage.getItem('loggedIn') == 'true') {
            window.location = '/home/mainmenu';
        } else {
            window.location = '/home/login/user';
        }
    }, []);
}