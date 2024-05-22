'use client';

import styles from './background.module.css';
import { useEffect } from 'react';

// start background
const bgsetup = () => {
    const canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        canvas2 = document.getElementById('canvas2'),
        ctx2 = canvas2.getContext('2d'),
        cw = window.innerWidth,
        ch = window.innerHeight,
        fontSize = 10,
        maxColums = cw / fontSize;

    // prettier-ignore
    const charArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',];

    canvas.width = canvas2.width = cw;
    canvas.height = canvas2.height = ch;
    let fallingCharArr = [];

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // individual falling character creator
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        draw(ctx) {
            this.value = charArr[randomInt(0, charArr.length - 1)].toUpperCase();
            this.speed = randomFloat(7, 10);

            ctx2.fillStyle = 'rgba(255,255,255,0.8)';
            ctx2.font = fontSize + 'px san-serif';
            ctx2.fillText(this.value, this.x, this.y);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px san-serif';
            ctx.fillText(this.value, this.x, this.y);

            this.y += this.speed;
            if (this.y > ch) {
                this.y = randomFloat(-100, 0);
                this.speed = randomFloat(7, 10);
            }
        }
    }

    // every 50ms updates display
    function update() {
        ctx.fillStyle = '#00000010';
        ctx.fillRect(0, 0, cw, ch);
        ctx2.clearRect(0, 0, cw, ch);
        let i = fallingCharArr.length;
        while (i--) {
            fallingCharArr[i].draw(ctx);
        }
        setTimeout(() => requestAnimationFrame(update), 50);
    }

    for (let i = 0; i < maxColums; i++) {
        const chance = randomInt(1, 100);
        if (chance < 70) continue;
        fallingCharArr.push(new Point(i * fontSize, randomFloat(-window.innerHeight, 0)));
    }

    update();
};

export default function Background() {
    useEffect(bgsetup, []);

    return (
        <div className={styles.background}>
            {/* incase the canvas is not supported */}
            <canvas id='canvas'>Canvas is not supported in your browser.</canvas>
            <canvas id='canvas2'>Canvas is not supported in your browser.</canvas>
        </div>
    );
}
