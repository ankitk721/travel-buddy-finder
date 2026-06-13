'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import AirportAutocomplete from '@/components/AirportAutocomplete'
import TripCard, { Trip, TripCardVariant } from '@/components/TripCard'

type ContactModalData = {
  trip: Trip
  email: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [lastFetch, setLastFetch] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [contactModal, setContactModal] = useState<ContactModalData | null>(null)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [filter, setFilter] = useState({
    origin: '',
    destination: '',
    companionType: 'all'
  })
  const [showPast, setShowPast] = useState(false)

  useEffect(() => {
    document.title = 'Browse Active Trips | Find Travel Companions for India-US Flights'
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    fetchTrips()
  }, [])

  const fetchTrips = async () => {
      const now = Date.now()
      const twoMinutes = 2 * 60 * 1000
        
     // Use cached data if less than 5 minutes old
      if (now - lastFetch < twoMinutes && trips.length > 0) {
        console.log('Using cached trips data')
        return
      }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTrips(data)
      console.log('Fetched new trips data' + now)
      setLastFetch(now)
    }
    setLoading(false)
  }

  const handleContactClick = async (trip: Trip) => {
    console.log('Contact clicked for trip:', trip.id)
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', trip.user_id)
        .single()

    console.log('Profile data:', profile)

    if (profile) {
        setContactModal({
        trip,
        email: profile.email
        })
    } else {
        console.error('No profile found for user_id:', trip.user_id)
    }
}

  const logContact = async (method: string) => {
    if (!user) return

    await supabase
      .from('trip_contacts')
      .insert([{
        trip_id: contactModal!.trip.id,
        contacted_by_user_id: user.id,
        contact_method: method
      }])
  }

  const openWhatsApp = () => {
    if (!contactModal) return
    
    const { trip } = contactModal
    const phone = trip.my_phone?.replace(/\D/g, '')
    const message = encodeURIComponent(
      `Hi ${trip.my_name}! I saw your post about ${trip.traveler_name} traveling from ${trip.origin} to ${trip.destination}. I'd like to connect about being travel companions.`
    )
    
    logContact('whatsapp')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const callPhone = () => {
    if (!contactModal) return
    logContact('phone')
    window.location.href = `tel:${contactModal.trip.my_phone}`
  }

  const copyEmail = async () => {
    if (!contactModal) return
    
    await navigator.clipboard.writeText(contactModal.email)
    setCopiedEmail(true)
    logContact('email_copy')
    
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const sendEmail = () => {
    if (!contactModal) return
    
    const { trip, email } = contactModal
    const subject = encodeURIComponent(`Travel Companion Request - ${trip.origin} to ${trip.destination}`)
    const body = encodeURIComponent(
      `Hi ${trip.my_name},\n\nI saw your post about ${trip.traveler_name} traveling from ${trip.origin} to ${trip.destination}.\n\nI would like to connect about being travel companions.\n\nBest regards`
    )
    
    logContact('email_send')
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

const tripVariant = (trip: Trip): TripCardVariant => {
  if (user && trip.user_id === user.id) return 'own'
  if (trip.companion_type === 'willing_companion') return 'volunteer'
  return 'seeking'
}

const isTripPast = (trip: Trip) => {
  const getTripEndDate = (trip: Trip) => {
    if (trip.booking_status === 'confirmed' && trip.flight_date) {
      return new Date(trip.flight_date)
    } else if (trip.booking_status === 'flexible' && trip.date_range_end) {
      return new Date(trip.date_range_end)
    }
    return null
  }

  const endDate = getTripEndDate(trip)
  if (!endDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return endDate < today
}

const filteredTrips = trips.filter(trip => {
  // Only apply location and companion type filters
    const extractLocation = (location: string) => {
        return location.toLowerCase().replace(/[()]/g, ' ')
    }
    
    if (filter.origin) {
        const searchOrigin = extractLocation(filter.origin)
        const tripOrigin = extractLocation(trip.origin)
        if (!tripOrigin.includes(searchOrigin) && !searchOrigin.includes(tripOrigin)) {
        return false
        }
    }
    
    if (filter.destination) {
        const searchDest = extractLocation(filter.destination)
        const tripDest = extractLocation(trip.destination)
        if (!tripDest.includes(searchDest) && !searchDest.includes(tripDest)) {
        return false
        }
    }
    
    if (filter.companionType !== 'all' && trip.companion_type !== filter.companionType) {
        return false
    }
    
    return true
  })

  // Own + upcoming trips go in the main grid; past trips (by others) go in a
  // collapsed section at the bottom.
  const { upcomingTrips, pastTrips } = (() => {
    const getPrimaryDate = (trip: Trip): Date | null => {
      if (trip.booking_status === 'confirmed' && trip.flight_date) return new Date(trip.flight_date)
      if (trip.booking_status === 'flexible' && trip.date_range_start) return new Date(trip.date_range_start)
      return null
    }

    const compareByPrimaryDate = (x: Trip, y: Trip) => {
      const dx = getPrimaryDate(x) ?? new Date('9999-12-31')
      const dy = getPrimaryDate(y) ?? new Date('9999-12-31')
      return dx.getTime() - dy.getTime()
    }

    // Partition trips
    const ownTrips: Trip[] = []
    const otherUpcoming: Trip[] = []
    const otherPast: Trip[] = []

    for (const t of filteredTrips) {
      const isMy = user && t.user_id === user.id
      if (isMy) {
        ownTrips.push(t)
        continue
      }

      if (isTripPast(t)) otherPast.push(t)
      else otherUpcoming.push(t)
    }

    // Sort each bucket by primary date (earliest first). Own trips also sorted by date.
    ownTrips.sort(compareByPrimaryDate)
    otherUpcoming.sort(compareByPrimaryDate)
    otherPast.sort(compareByPrimaryDate)

    return { upcomingTrips: [...ownTrips, ...otherUpcoming], pastTrips: otherPast }
  })()

  const hasAnyTrips = upcomingTrips.length + pastTrips.length > 0

  return (
    <div className="min-h-screen bg-canvas">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-stone-900 mb-1">Find Travel Companions</h1>
          <p className="text-base text-stone-600">
            Connect with other families or volunteers on similar routes
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
                <AirportAutocomplete
                label="Origin"
                value={filter.origin}
                onChange={(value) => setFilter(prev => ({ ...prev, origin: value }))}
                placeholder="Any origin"
                />
                <AirportAutocomplete
                label="Destination"
                value={filter.destination}
                onChange={(value) => setFilter(prev => ({ ...prev, destination: value }))}
                placeholder="Any destination"
                />
                <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Companion Type</label>
                <select
                    value={filter.companionType}
                    onChange={(e) => setFilter(prev => ({ ...prev, companionType: e.target.value }))}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-stone-900"
                >
                    <option value="all">All Types</option>
                    <option value="need_companion">Need Companion</option>
                    <option value="willing_companion">Willing to Help</option>
                </select>
                </div>
            </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-stone-600">Loading trips...</p>
          </div>
        ) : !hasAnyTrips ? (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
            <p className="text-xl text-stone-600 mb-4">
              {trips.length === 0 ? 'No trips posted yet' : 'No trips match your filters'}
            </p>
            {user && trips.length === 0 && (
              <Link
                href="/trips/new"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-medium transition"
              >
                Be the first to post!
              </Link>
            )}
          </div>
        ) : (
          <>
            {upcomingTrips.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    variant={tripVariant(trip)}
                    isPast={false}
                    isSignedIn={!!user}
                    onContact={handleContactClick}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
                <p className="text-lg text-stone-600">No upcoming trips match your filters</p>
              </div>
            )}

            {pastTrips.length > 0 && (
              <div className="mt-10 border-t border-stone-200 pt-6">
                <button
                  onClick={() => setShowPast((prev) => !prev)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-semibold text-stone-600">
                    Past trips ({pastTrips.length})
                  </span>
                  <svg
                    className={`h-4 w-4 text-stone-400 transition-transform ${showPast ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {showPast && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {pastTrips.map((trip) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        variant={tripVariant(trip)}
                        isPast
                        isSignedIn={!!user}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {contactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Contact {contactModal.trip.my_name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  About {contactModal.trip.traveler_name}'s trip: {contactModal.trip.origin} → {contactModal.trip.destination}
                </p>
              </div>
              <button 
                onClick={() => setContactModal(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {contactModal.trip.my_phone && (
                <button 
                  onClick={openWhatsApp}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
                >
                  <span className="text-xl">💬</span>
                  <span>Message on WhatsApp</span>
                </button>
              )}

              {contactModal.trip.my_phone && (
                <button 
                  onClick={callPhone}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
                >
                  <span className="text-xl">📞</span>
                  <span>Call {contactModal.trip.my_phone}</span>
                </button>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Email Address:</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 flex-1 break-all">{contactModal.email}</p>
                  <button 
                    onClick={copyEmail}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium whitespace-nowrap"
                  >
                    {copiedEmail ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <button 
                onClick={sendEmail}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <span className="text-xl">✉️</span>
                <span>Send Email</span>
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                💡 On desktop? WhatsApp requires your phone to be connected. Consider emailing instead.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}