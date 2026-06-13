import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-app-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.travel-buddy-finder.com'),
  title: {
    default: 'Travel Buddy Finder — Find Travel Companions for Elderly Parents',
    template: '%s | Travel Buddy Finder',
  },
  description: 'Help elderly Indian parents travel safely between India and the US by connecting them with fellow travelers on the same route. Free, community-driven, and easy to use.',
  keywords: 'travel companion, elderly parents, India US flights, travel buddy, senior travel, India America flight companion',
  openGraph: {
    title: 'Travel Buddy Finder — Find Travel Companions for Elderly Parents',
    description: 'Connect elderly parents with fellow travelers on India–US flights. Free, safe, and community-driven.',
    url: 'https://www.travel-buddy-finder.com',
    siteName: 'Travel Buddy Finder',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Buddy Finder — Find Travel Companions for Elderly Parents',
    description: 'Connect elderly parents with fellow travelers on India–US flights. Free, safe, and community-driven.',
  },
  alternates: {
    canonical: 'https://www.travel-buddy-finder.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  )
}
