'use client';

import { useEffect, useState } from 'react';
import styles from './bg.module.css';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { BGoptions } from './bgoptions';

export default function GameBackground() {
    const [init, setInit] = useState(false);
    const options = BGoptions;

    // code to initialise custom particle library
    useEffect(() => {
        initParticlesEngine(async engine => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (init) {
        return (
            <div className={styles.background}>
                {/* custom particle library */}
                <Particles id='tsparticles' options={options} />
            </div>
        );
    }

    return <></>;
}
