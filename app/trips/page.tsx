'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState({
    origin: '',
    destination: '',
    companionType: 'all'
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTrips(data)
    }
    setLoading(false)
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
      'fellow_parent': { text: 'Fellow Parent', color: 'bg-blue-100 text-blue-800' },
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
    if (filter.origin && !trip.origin.toLowerCase().includes(filter.origin.toLowerCase())) return false
    if (filter.destination && !trip.destination.toLowerCase().includes(filter.destination.toLowerCase())) return false
    if (filter.companionType !== 'all' && trip.companion_type !== filter.companionType) return false
    return true
  })

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    // Volunteers always come first
    if (a.companion_type === 'willing_companion' && b.companion_type !== 'willing_companion') return -1
    if (b.companion_type === 'willing_companion' && a.companion_type !== 'willing_companion') return 1
    
    // Then sort by date
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Travel Buddy Finder
          </Link>
          <div className="flex gap-4">
            {user && (
              <Link 
                href="/trips/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
              >
                + Post Trip
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Travel Companions</h1>
          <p className="text-gray-700 text-lg">
            Connect with other families or volunteers on similar routes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Trips</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <input
                type="text"
                value={filter.origin}
                onChange={(e) => setFilter(prev => ({ ...prev, origin: e.target.value }))}
                placeholder="e.g., Delhi, Mumbai"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                value={filter.destination}
                onChange={(e) => setFilter(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="e.g., SFO, NYC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Companion Type</label>
              <select
                value={filter.companionType}
                onChange={(e) => setFilter(prev => ({ ...prev, companionType: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
              >
                <option value="all">All Types</option>
                <option value="fellow_parent">Fellow Parents</option>
                <option value="willing_companion">Willing Helpers</option>
                <option value="need_companion">Need Companion</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading trips...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
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
                
                return (
                <div 
                    key={trip.id} 
                    className={`bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden ${
                    isVolunteer ? 'ring-2 ring-yellow-400 shadow-yellow-100' : ''
                    }`}
                >
                    {/* Header with companion type badge */}
                    <div className={`px-6 py-3 ${
                    isVolunteer 
                        ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-b-2 border-yellow-400' 
                        : `${companionType.color} border-b`
                    }`}>
                    <div className="flex items-center gap-2">
                        {isVolunteer && <span className="text-xl">⭐</span>}
                        <span className={`text-sm font-semibold ${isVolunteer ? 'text-yellow-900' : ''}`}>
                        {companionType.text}
                        </span>
                    </div>
                    </div>

                  <div className="p-6">
                    {/* Traveler Info */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {trip.traveler_name}
                      </h3>
                      {trip.traveler_age && (
                        <p className="text-gray-600 text-sm">Age {trip.traveler_age}</p>
                      )}
                    </div>

                    {/* Route */}
                    <div className="mb-4 pb-4 border-b">
                      <div className="flex items-center justify-between text-lg">
                        <span className="font-semibold text-gray-900">{trip.origin}</span>
                        <span className="text-indigo-600 mx-2">✈️</span>
                        <span className="font-semibold text-gray-900">{trip.destination}</span>
                      </div>
                    </div>

                    {/* Date Info */}
                    <div className="mb-4">
                      {trip.booking_status === 'confirmed' && trip.flight_date ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                              CONFIRMED
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {formatDate(trip.flight_date)}
                            </span>
                          </div>
                          {trip.airline && (
                            <p className="text-sm text-gray-600">
                              {trip.airline} {trip.flight_number && `• ${trip.flight_number}`}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                              FLEXIBLE
                            </span>
                          </div>
                          {trip.date_range_start && trip.date_range_end && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Date Range:</span><br />
                              {formatDate(trip.date_range_start)} - {formatDate(trip.date_range_end)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Languages */}
                    {trip.traveler_languages && trip.traveler_languages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Languages:</p>
                        <div className="flex flex-wrap gap-1">
                          {trip.traveler_languages.map(lang => (
                            <span key={lang} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Help Needed */}
                    {trip.needs_help_with && trip.needs_help_with.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Needs help with:</p>
                        <div className="flex flex-wrap gap-1">
                          {trip.needs_help_with.map(help => (
                            <span key={help} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                              {getHelpLabel(help)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes Preview */}
                    {trip.notes && (
                      <div className="mb-4 text-sm text-gray-600 line-clamp-2 italic">
                        "{trip.notes}"
                      </div>
                    )}

                    {/* Posted By */}
                    <div className="text-xs text-gray-500 mb-4">
                      Posted by: <span className="font-medium text-gray-700">{trip.my_name}</span>
                    </div>

                    {/* Contact Button */}
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
                      Contact
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}