'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Contact = {
  contacted_by_name: string
  contacted_by_email: string
  contact_method: string
  created_at: string
}

type MyTrip = {
  id: string
  traveler_name: string
  origin: string
  destination: string
  flight_date: string | null
  date_range_start: string | null
  date_range_end: string | null
  booking_status: string
  airline: string | null
  flight_number: string | null
  status: string
  created_at: string
  contacts: Contact[]
}

export default function MyTripsPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<MyTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Get user's trips
      const { data: tripsData } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (tripsData) {
        // For each trip, get contacts
        const tripsWithContacts = await Promise.all(
          tripsData.map(async (trip) => {
            const { data: contactsData } = await supabase
              .from('trip_contacts')
              .select(`
                contact_method,
                created_at,
                contacted_by_user_id
              `)
              .eq('trip_id', trip.id)
              .order('created_at', { ascending: false })

            // Get profile info for each contact
            const contacts = await Promise.all(
              (contactsData || []).map(async (contact) => {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('name, email')
                  .eq('id', contact.contacted_by_user_id)
                  .single()

                return {
                  contacted_by_name: profile?.name || 'Unknown',
                  contacted_by_email: profile?.email || '',
                  contact_method: contact.contact_method,
                  created_at: contact.created_at
                }
              })
            )

            return {
              ...trip,
              contacts
            }
          })
        )

        setTrips(tripsWithContacts)
      }

      setLoading(false)
    }

    init()
  }, [router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      'whatsapp': '💬',
      'phone': '📞',
      'email_copy': '📋',
      'email_send': '✉️'
    }
    return icons[method] || '📧'
  }

  const deleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip? This cannot be undone.')) return

    const { error } = await supabase.rpc('delete_trip', {
      trip_id: tripId
    })

    if (error) {
      console.error('Error:', error)
      alert('Error deleting trip: ' + error.message)
    } else {
      // Remove from local state
      setTrips(trips.filter(t => t.id !== tripId))
    }
  }

  const toggleTripStatus = async (tripId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'completed' : 'active'
    
    const { error } = await supabase.rpc('update_trip_status', {
      trip_id: tripId,
      new_status: newStatus
    })

    if (error) {
      console.error('Error:', error)
      alert('Error updating trip: ' + error.message)
    } else {
      // Update local state
      setTrips(trips.map(t => 
        t.id === tripId ? { ...t, status: newStatus } : t
      ))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-xl text-gray-600">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Posted Trips</h1>
        <p className="text-gray-700 mb-8">Manage your trips and see who contacted you</p>

        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✈️</div>
            <p className="text-xl text-gray-600 mb-2">You haven't posted any trips yet</p>
            <p className="text-gray-500 mb-6">Start by posting your first trip to find travel companions</p>
            
            <Link
              href="/trips/new"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition"
            >
              Post Your First Trip
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Trip Header */}
                <div className={`px-6 py-4 border-b ${
                  trip.status === 'active' ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{trip.traveler_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trip.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {trip.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </div>
                      
                      <div className="text-gray-700 mb-2">
                        <span className="font-semibold">{trip.origin}</span>
                        <span className="mx-2">→</span>
                        <span className="font-semibold">{trip.destination}</span>
                      </div>

                      {trip.booking_status === 'confirmed' && trip.flight_date ? (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Flight:</span> {formatDate(trip.flight_date)}
                          {trip.airline && ` • ${trip.airline}`}
                          {trip.flight_number && ` ${trip.flight_number}`}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Flexible:</span> {trip.date_range_start && formatDate(trip.date_range_start)} - {trip.date_range_end && formatDate(trip.date_range_end)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleTripStatus(trip.id, trip.status)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded hover:bg-indigo-50 transition"
                      >
                        {trip.status === 'active' ? '✓ Mark Complete' : '↻ Reactivate'}
                      </button>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contacts Section */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">
                      Contacts ({trip.contacts.length})
                    </h4>
                    {trip.contacts.length > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        🎉 People are interested!
                      </span>
                    )}
                  </div>

                  {trip.contacts.length > 0 ? (
                    <div className="space-y-2">
                      {trip.contacts.map((contact, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{contact.contacted_by_name}</p>
                            <p className="text-sm text-gray-600">{contact.contacted_by_email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-700 mb-1">
                              {getMethodIcon(contact.contact_method)} {contact.contact_method.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(contact.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-2">No contacts yet</p>
                      <p className="text-sm text-gray-400">Share your trip or wait for matches</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}