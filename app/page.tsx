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
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <p className="text-xl text-stone-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-6">
          Find Travel Companions for Your Parents
        </h2>
        <p className="text-xl text-stone-600 mb-6">
          Help elderly parents travel safely between India and US with fellow travelers on the same route
        </p>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-600">
            <span className="font-semibold text-primary-700">{stats.activeTrips}</span> active trips
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-600">
            <span className="font-semibold text-primary-700">{stats.thisWeek}</span> posted this week
          </span>
        </div>

        {/* CTA Buttons - Update spacing */}
        {user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trips"
              className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition text-center"
            >
              Browse Trips
            </Link>
            <Link
              href="/trips/new"
              className="w-full sm:w-auto bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition text-center"
            >
              Post a Trip
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trips"
              className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition text-center"
            >
              Browse Trips
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition text-center"
            >
              Get Started - It's Free
            </Link>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-20 mb-16">
          <h3 className="text-3xl font-bold text-stone-900 mb-10">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-left">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-xl">📝</div>
              <h4 className="text-lg font-semibold text-stone-900 mb-1">1. Post Your Trip</h4>
              <p className="text-sm text-stone-600">Share parent's travel route and dates (confirmed or flexible)</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-left">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-xl">🔍</div>
              <h4 className="text-lg font-semibold text-stone-900 mb-1">2. Find Companions</h4>
              <p className="text-sm text-stone-600">Browse travelers on same route within ±3 days</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-left">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-xl">💬</div>
              <h4 className="text-lg font-semibold text-stone-900 mb-1">3. Connect Directly</h4>
              <p className="text-sm text-stone-600">Contact via Email or WhatsApp to coordinate airport meetup</p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-2xl font-bold text-stone-900 mb-6">Why Families Trust Us</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Free Forever', body: 'No hidden fees or subscriptions' },
              { title: 'Contact Info Protected', body: 'Visible only after login with email verification' },
              { title: 'Real Travelers', body: 'Phone & email required for all posts' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-2">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-confirmed-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21.8 10A10 10 0 1 1 12 2c1.6 0 3.1.4 4.5 1" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <div>
                  <h4 className="font-semibold text-stone-900">{item.title}</h4>
                  <p className="text-sm text-stone-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Case Example */}
        <div className="mt-12 rounded-xl border border-stone-200 border-l-4 border-l-primary-500 bg-canvas-deep p-6 text-left">
          <p className="text-stone-600 italic">
            "Planning your mother's trip from Mumbai to San Francisco? Find other families with parents traveling the same week."
          </p>
        </div>
      </main>
    </div>
  )
}