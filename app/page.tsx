'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'


export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Help Elderly Parents Find Travel Companions
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Connect with other families whose parents are traveling on the same flights. 
          Never let your parents navigate airports alone.
        </p>

        {user ? (
          <div className="space-y-4">
            <Link
              href="/trips/new"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            >
              Post a Trip
            </Link>
            <br />
            <Link
              href="/trips"
              className="inline-block text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Browse Available Companions →
            </Link>
          </div>
        ) : (
          <Link
            href="/signup"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
          >
            Get Started - It's Free
          </Link>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Same Flight Matching</h3>
            <p className="text-gray-600">Find companions on the exact same flight or similar routes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe Community</h3>
            <p className="text-gray-600">Connect with verified families in similar situations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Communication</h3>
            <p className="text-gray-600">Message and coordinate before the travel date</p>
          </div>
        </div>
      </main>
    </div>
  )
}