'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Trip = {
  id: string
  parent_name: string
  parent_age: number | null
  origin: string
  destination: string
  flight_date: string | null
  booking_status?: 'confirmed' | 'flexible' | string | null
  date_range_start?: string | null
  date_range_end?: string | null
  flight_number: string | null
  airline: string | null
  notes: string | null
  created_at: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'active')
        .order('flight_date', { ascending: true })

      if (!error && data) {
        setTrips(data)
      }
      setLoading(false)
    }

    fetchTrips()
  }, [])

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Travel Companions</h1>
          <p className="text-gray-700 text-lg">
            Find other families whose parents are traveling on similar routes
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">No trips posted yet</p>
            {user && (
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
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{trip.parent_name}</h3>
                    {trip.parent_age && (
                      <p className="text-gray-600 text-sm">Age {trip.parent_age}</p>
                    )}
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {trip.booking_status === 'confirmed' && trip.flight_date ? (
                      formatDate(trip.flight_date)
                    ) : trip.booking_status === 'flexible' ? (
                      // show a range if both bounds exist, otherwise show partial/fallback text
                      trip.date_range_start && trip.date_range_end ? (
                        `${formatDate(trip.date_range_start)} – ${formatDate(trip.date_range_end)}`
                      ) : trip.date_range_start ? (
                        `From ${formatDate(trip.date_range_start)}`
                      ) : trip.date_range_end ? (
                        `Until ${formatDate(trip.date_range_end)}`
                      ) : (
                        'Flexible dates'
                      )
                    ) : (
                      // fallback: if flight_date exists show it, otherwise generic
                      trip.flight_date ? formatDate(trip.flight_date) : 'Date TBD'
                    )}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">Route:</span>
                    <span className="ml-2">{trip.origin} → {trip.destination}</span>
                  </div>
                  
                  {trip.airline && (
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium">Airline:</span>
                      <span className="ml-2">{trip.airline}</span>
                    </div>
                  )}
                  
                  {trip.flight_number && (
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium">Flight:</span>
                      <span className="ml-2">{trip.flight_number}</span>
                    </div>
                  )}
                </div>

                {trip.notes && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {trip.notes}
                  </p>
                )}

                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
                  Contact
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}