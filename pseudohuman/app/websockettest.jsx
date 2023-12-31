'use client'

import { useEffect, useState } from "react"
import styles from '@/app/styles/home.module.css'
import io from "socket.io-client"

const socket = io('http://localhost:3001');


export default function Home() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageArray, setMessagesArray] = useState([]);
  
  const handletype = (event) => {
    setCurrentMessage(event.target.value);
  }

  // send message
  function submitmessage() {
    socket.emit('sent-message', currentMessage);
  }

  // recieve message
  useEffect(() => {
    socket.on('send-message', (messageAr) => {
      setMessagesArray(messageAr);
    });
  }, []);

  return (
    <main>
      <h1>Hi, this is a testing page</h1>
      <div>{messageArray.map((item, index) => <p key={index}>{item}</p>)}</div>
      <input type='text' onKeyUp={handletype} placeholder="message" />
      <button onClick={submitmessage} className={styles.button}>Send</button>
    </main>
  )
}