import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Travel Buddy Finder',
    short_name: 'Travel Buddy',
    description: 'Find travel companions for elderly parents on India–US flights. Free, safe, and community-driven.',
    start_url: '/',
    display: 'standalone',
    background_color: '#eef2ff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
