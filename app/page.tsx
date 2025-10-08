'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      const { data, error } = await supabase.from('trips').select('count')
      if (!error) setConnected(true)
    }
    checkConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Travel Buddy Finder</h1>
        <p className="text-xl">
          Database: {connected ? '✅ Connected!' : '❌ Not connected'}
        </p>
      </div>
    </div>
  )
}