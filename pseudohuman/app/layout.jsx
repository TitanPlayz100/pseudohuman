import styles from '@/app/styles/main.module.css'

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className={styles.homepage}>{children}</body>
        </html>
    )
}