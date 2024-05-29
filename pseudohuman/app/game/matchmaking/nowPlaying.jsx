import { useState } from 'react';

export default function NowPlaying({ text }) {
    const [loaded, setLoaded] = useState(true);

    setTimeout(() => {
        setLoaded(false);
    }, 2000);

    const cssLoaded = {
        width: '100vw',
        position: 'absolute',
        bottom: '5vh',
        color: 'white',
        opacity: loaded ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all 3s ease-in',
    };

    const cssText = {
        textAlign: 'center',
    };

    return (
        <div style={cssLoaded}>
            <p style={cssText}>
                Playing - <span style={{ color: 'gray' }}>{text}</span>
            </p>
        </div>
    );
}
