import styles from '@/app/global.module.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Suspense } from 'react';

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className={styles.homepage}>
                <Suspense>
                    {children}
                    {/* analytics to help degub */}
                    <SpeedInsights />
                    <Analytics />
                </Suspense>
            </body>
        </html>
    );
}
