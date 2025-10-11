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
  const [stats, setStats] = useState({ activeTrips: 0, thisWeek: 0 })

  useEffect(() => {
    document.title = 'Find Travel Companions for Elderly Parents | India-US Flights'
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    // Fetch trip stats
    const fetchStats = async () => {
      const { count: activeCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count: weekCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('created_at', sevenDaysAgo.toISOString())

      setStats({
        activeTrips: activeCount || 0,
        thisWeek: weekCount || 0
      })
    }
    fetchStats()

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
          Find Travel Companions for Your Parents
        </h2>
        <p className="text-xl text-gray-700 mb-4">
          Help elderly parents travel safely between India and US with fellow travelers on the same route
        </p>

        {/* Stats Bar */}
        <div className="text-center text-gray-600 mb-8">
          <span className="font-semibold text-indigo-600">{stats.activeTrips}</span> active trips • 
          <span className="font-semibold text-indigo-600 ml-1">{stats.thisWeek}</span> posted this week
        </div>

        {user ? (
          <div className="space-x-4">
            <Link
              href="/trips"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Trips
            </Link>
            <Link
              href="/trips/new"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
            >
              Post a Trip
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              href="/trips"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Trips
            </Link>
            <Link
              href="/signup"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
            >
              Get Started - It's Free
            </Link>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-20 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-10">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Post Your Trip</h4>
              <p className="text-gray-600">Share parent's travel route and dates (confirmed or flexible)</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Find Companions</h4>
              <p className="text-gray-600">Browse travelers on same route within ±3 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Connect Directly</h4>
              <p className="text-gray-600">Contact via Email or WhatsApp to coordinate airport meetup</p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Families Trust Us</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="flex items-start">
                <span className="text-green-600 text-xl mr-2">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Free Forever</h4>
                  <p className="text-sm text-gray-600">No hidden fees or subscriptions</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <span className="text-green-600 text-xl mr-2">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Contact Info Protected</h4>
                  <p className="text-sm text-gray-600">Visible only after login with email verification</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <span className="text-green-600 text-xl mr-2">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Real Travelers</h4>
                  <p className="text-sm text-gray-600">Phone & email required for all posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Case Example */}
        <div className="mt-12 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-gray-700 italic">
            "Planning your mother's trip from Mumbai to San Francisco? Find other families with parents traveling the same week."
          </p>
        </div>
      </main>
    </div>
  )
}