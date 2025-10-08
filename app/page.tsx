'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      const { data, error } = await supabase.from('trips').select('count')
      if (!error) setConnected(true)
      setLoading(false)
    }
    checkConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-12 max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Travel Buddy Finder
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Helping elderly parents find travel companions
        </p>
        
        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 mb-2">Database Status:</p>
          {loading ? (
            <p className="text-lg text-gray-500">Checking...</p>
          ) : connected ? (
            <p className="text-2xl font-semibold text-green-600">✅ Connected!</p>
          ) : (
            <p className="text-2xl font-semibold text-red-600">❌ Not Connected</p>
          )}
        </div>
      </div>
    </div>
  )
}