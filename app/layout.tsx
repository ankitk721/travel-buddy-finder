import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Travel Buddy Finder - Connect Elderly Travelers',
  description: 'Find travel companions for elderly parents traveling internationally. Safe, verified community for airport navigation help.',
  keywords: 'travel companion, elderly travel, airport help, travel buddy',
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