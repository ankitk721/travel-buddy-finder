'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import AirportAutocomplete from '@/components/AirportAutocomplete'

type Trip = {
  id: string
  user_id: string
  my_name: string
  my_phone: string | null
  traveler_name: string
  traveler_age: number | null
  traveler_languages: string[] | null
  origin: string
  destination: string
  booking_status: string
  flight_date: string | null
  flight_number: string | null
  airline: string | null
  date_range_start: string | null
  date_range_end: string | null
  companion_type: string
  needs_help_with: string[] | null
  notes: string | null
  created_at: string
}

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getCompanionTypeLabel = (type: string) => {
    const labels: Record<string, { text: string; color: string }> = {
        'willing_companion': { text: 'Willing to Help', color: 'bg-green-100 text-green-800' },
        'need_companion': { text: 'Need Companion', color: 'bg-orange-100 text-orange-800' }
   }
    return labels[type] || { text: type, color: 'bg-gray-100 text-gray-800' }
  }

  const getHelpLabel = (help: string) => {
    const labels: Record<string, string> = {
      'wheelchair': '♿ Wheelchair',
      'language': '💬 Language',
      'first_time': '✈️ First Time',
      'connecting_flight': '🔄 Connections',
      'baggage': '🧳 Baggage',
      'navigation': '🗺️ Navigation'
    }
    return labels[help] || help
  }

const filteredTrips = trips.filter(trip => {
  // Extract just the city/code from formats like "San Francisco (SFO)"
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

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (a.companion_type === 'willing_companion' && b.companion_type !== 'willing_companion') return -1
    if (b.companion_type === 'willing_companion' && a.companion_type !== 'willing_companion') return 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Travel Companions</h1>
          <p className="text-gray-700 text-lg">
            Connect with other families or volunteers on similar routes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Trips</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Companion Type</label>
                <select
                    value={filter.companionType}
                    onChange={(e) => setFilter(prev => ({ ...prev, companionType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
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
            <p className="text-xl text-gray-600">Loading trips...</p>
          </div>
        ) : sortedTrips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">
              {trips.length === 0 ? 'No trips posted yet' : 'No trips match your filters'}
            </p>
            {user && trips.length === 0 && (
              <Link
                href="/trips/new"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
              >
                Be the first to post!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTrips.map((trip) => {
                const companionType = getCompanionTypeLabel(trip.companion_type)
                const isVolunteer = trip.companion_type === 'willing_companion'
                const isMyTrip = user && trip.user_id === user.id
                
                return (
                    <div 
                    key={trip.id} 
                    className={`bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden ${
                        isVolunteer ? 'ring-2 ring-yellow-400' : ''
                    } ${
                        isMyTrip ? 'ring-2 ring-indigo-400' : ''
                    }`}
                    >
                    {/* Header - More Compact */}
                    <div className={`px-4 py-2 ${
                        isMyTrip
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-indigo-400'
                        : isVolunteer 
                            ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-b border-yellow-400' 
                            : `${companionType.color} border-b`
                    }`}>
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isVolunteer && <span className="text-lg">⭐</span>}
                            <span className={`text-xs font-semibold ${
                            isMyTrip ? 'text-indigo-900' : isVolunteer ? 'text-yellow-900' : ''
                            }`}>
                            {companionType.text}
                            </span>
                        </div>
                        {isMyTrip && (
                            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                            YOUR TRIP
                            </span>
                        )}
                        </div>
                    </div>

                    <div className="p-4">
                        {/* Traveler Info - Compact */}
                        <div className="mb-3">
                        <div className="flex items-baseline gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                            {trip.traveler_name}
                            </h3>
                            {trip.traveler_age && (
                            <span className="text-xs text-gray-500">{trip.traveler_age}y</span>
                            )}
                        </div>
                        </div>

                        {/* Route - Compact */}
                        <div className="mb-3 pb-3 border-b">
                        <div className="flex items-center justify-center gap-2 text-base">
                            <span className="font-semibold text-gray-900">{trip.origin}</span>
                            <span className="text-indigo-600">→</span>
                            <span className="font-semibold text-gray-900">{trip.destination}</span>
                        </div>
                        </div>

                        {/* Date Info - Inline and Compact */}
                        <div className="mb-3 flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            trip.booking_status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {trip.booking_status === 'confirmed' ? 'CONFIRMED' : 'FLEXIBLE'}
                        </span>
                        <span className="text-sm text-gray-700">
                            {trip.booking_status === 'confirmed' && trip.flight_date 
                            ? formatDate(trip.flight_date)
                            : trip.date_range_start && trip.date_range_end
                                ? `${formatDate(trip.date_range_start)} - ${formatDate(trip.date_range_end)}`
                                : 'Dates TBD'
                            }
                        </span>
                        </div>

                        {/* Flight Info - Only if confirmed */}
                        {trip.booking_status === 'confirmed' && trip.airline && (
                        <div className="mb-3 text-xs text-gray-600">
                            ✈️ {trip.airline}{trip.flight_number && ` ${trip.flight_number}`}
                        </div>
                        )}

                        {/* Languages - Compact Inline */}
                        {trip.traveler_languages && trip.traveler_languages.length > 0 && (
                        <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                            {trip.traveler_languages.slice(0, 3).map(lang => (
                                <span key={lang} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {lang}
                                </span>
                            ))}
                            {trip.traveler_languages.length > 3 && (
                                <span className="text-xs text-gray-500">+{trip.traveler_languages.length - 3}</span>
                            )}
                            </div>
                        </div>
                        )}

                        {/* Help Needed - Show max 3 */}
                        {trip.needs_help_with && trip.needs_help_with.length > 0 && (
                        <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                            {trip.needs_help_with.slice(0, 3).map(help => (
                                <span key={help} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                                {getHelpLabel(help).replace(/[^\w\s]/g, '')}
                                </span>
                            ))}
                            {trip.needs_help_with.length > 3 && (
                                <span className="text-xs text-gray-500">+{trip.needs_help_with.length - 3} more</span>
                            )}
                            </div>
                        </div>
                        )}

                        {/* Notes - Shorter Preview */}
                        {trip.notes && (
                        <div className="mb-3 text-xs text-gray-600 line-clamp-1 italic">
                            "{trip.notes}"
                        </div>
                        )}

                        {/* Posted By - Smaller */}
                        <div className="text-xs text-gray-400 mb-3">
                        by {isMyTrip ? 'You' : trip.my_name}
                        </div>

                        {/* Contact Button or Your Trip Message */}
                        {isMyTrip ? (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
                                <p className="text-sm text-indigo-900 font-medium mb-1">Your trip</p>
                                <Link href="/my-trips" className="text-xs text-indigo-700 underline font-semibold">
                                Manage →
                                </Link>
                            </div>
                            ) : !user ? (
                            // Show login prompt for logged-out users
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-700 mb-2">Sign in to contact</p>
                                <Link 
                                href="/login" 
                                className="text-xs text-indigo-600 hover:text-indigo-800 underline font-semibold"
                                >
                                Log in →
                                </Link>
                            </div>
                            ) : (
                            <button 
                                onClick={() => handleContactClick(trip)}
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                            >
                                Contact
                            </button>
                        )}
                    </div>
                </div>
                )
                })}
          </div>
        )}
      </main>

      {contactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
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
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium whitespace-nowrap"
                  >
                    {copiedEmail ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <button 
                onClick={sendEmail}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium"
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