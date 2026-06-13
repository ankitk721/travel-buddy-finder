import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Travel Buddy Finder — Find Travel Companions for Elderly Parents'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: 80, marginBottom: 24 }}>✈️</div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#134e4a',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Travel Buddy Finder
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: '#0f766e',
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          Find travel companions for elderly parents on India–US flights
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['Free to use', 'Verified travelers', 'WhatsApp & email'].map((label) => (
            <div
              key={label}
              style={{
                background: '#0d9488',
                color: 'white',
                borderRadius: 999,
                padding: '10px 22px',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            fontSize: 18,
            color: '#14b8a6',
            fontWeight: 500,
          }}
        >
          travel-buddy-finder.com
        </div>
      </div>
    ),
    { ...size }
  )
}
