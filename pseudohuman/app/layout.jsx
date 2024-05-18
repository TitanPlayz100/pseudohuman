import styles from './background.module.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className={styles.homepage}>
                {children}

                {/* analytics to help degub */}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    )
}