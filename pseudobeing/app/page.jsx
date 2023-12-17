'use client'

import styles from '@/app/main.module.css'
import { useState } from 'react'

export default function Home() {
  const [state, setstate] = useState("default");

  function cycleStates() {
    switch (state) {
      case "default":
        setstate("state 1")
        break;

      case "state 1":
        setstate("state 2")
        break;
      
      case "state 2":
        setstate("default")
        break;
    
      default:
        break;
    }
  }

  return (
    <main className={styles.main}>
      <h1>Hi</h1>
      <p>{state}</p>
      <button onClick={cycleStates}>Cycle states</button>
    </main>
  )
}
