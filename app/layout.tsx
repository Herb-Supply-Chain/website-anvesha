import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'ANVESHA - Ayurvedic Herb Traceability',
    description: 'Blockchain-based traceability system for Ayurvedic herbs',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
