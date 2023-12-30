'use client'

import { redirect } from "next/navigation"
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        if (localStorage.getItem('loggedIn')) {
            redirect('/home/mainmenu');
        } else {
            redirect('/home/login');
        }
    }, []);
}