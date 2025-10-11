import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Travel Buddy Finder - Find Travel Companions for Elderly Parents',
    template: '%s | Travel Buddy Finder'
  },
  description: 'Help elderly Indian parents find travel companions for international flights between India and US.',
  keywords: 'travel companion, elderly parents, India US flights, travel buddy',
  openGraph: {
    title: 'Travel Buddy Finder',
    description: 'Find travel companions for elderly parents on India-US flights',
    url: 'https://www.travel-buddy-finder.com',
    siteName: 'Travel Buddy Finder',
    type: 'website',
  },
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

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Travel Buddy Finder',
      url: 'https://www.travel-buddy-finder.com/',
      description: 'Find travel companions for elderly parents on India-US flights',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.travel-buddy-finder.com/trips?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }),
  }}
/>