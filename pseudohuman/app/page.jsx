'use client'
import { useEffect } from "react";
export default function Home() {
    useEffect(() => {
        if (localStorage.getItem('username') == null) {
            window.location = '/home/login/user';
        } else {
            window.location = '/home/mainmenu';
        }
    }, []);
}