'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import AirportAutocomplete from '@/components/AirportAutocomplete'

export default function NewTrip() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Around line 38
  const [formData, setFormData] = useState({
    my_name: '',
    my_phone: '',
    traveler_name: '',
    traveler_age: '',
    traveler_languages: [] as string[],
    origin: '',
    destination: '',
    booking_status: 'flexible',
    flight_date: '',
    flight_number: '',
    airline: '',
    date_range_start: '',
    date_range_end: '',
    companion_type: 'need_companion', // Changed default
    needs_help_with: [] as string[],
    notes: ''
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate based on booking status
    if (formData.booking_status === 'confirmed' && !formData.flight_date) {
      setError('Flight date is required for confirmed bookings')
      setLoading(false)
      return
    }

    if (formData.booking_status === 'flexible' && (!formData.date_range_start || !formData.date_range_end)) {
      setError('Date range is required for flexible bookings')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('trips')
      .insert([
        {
          user_id: user.id,
          my_name: formData.my_name,
          my_phone: formData.my_phone || null,
          traveler_name: formData.traveler_name,
          traveler_age: parseInt(formData.traveler_age) || null,
          traveler_languages: formData.traveler_languages.length > 0 ? formData.traveler_languages : null,
          origin: formData.origin,
          destination: formData.destination,
          booking_status: formData.booking_status,
          flight_date: formData.booking_status === 'confirmed' ? formData.flight_date : null,
          flight_number: formData.flight_number || null,
          airline: formData.airline || null,
          date_range_start: formData.booking_status === 'flexible' ? formData.date_range_start : null,
          date_range_end: formData.booking_status === 'flexible' ? formData.date_range_end : null,
          companion_type: formData.companion_type,
          needs_help_with: formData.needs_help_with.length > 0 ? formData.needs_help_with : null,
          notes: formData.notes || null,
          status: 'active'
        }
      ])

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/trips')
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: 'traveler_languages' | 'needs_help_with', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/trips" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Trips
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Travel Companion</h1>
          <p className="text-gray-600 mb-6">
            Help your parent find a companion for their journey
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Your Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Information</h2>
              
              {/* Privacy Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong className="font-semibold">Privacy Notice:</strong> Your contact information (name, phone, email) will be visible to other registered users who are looking for travel companions. Only share details you're comfortable with.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.my_name}
                    maxLength={30}
                    onChange={(e) => handleChange('my_name', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                    placeholder="Your full name"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be shown to potential companions
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Phone Number (optional but recommended)
                  </label>
                  <input
                    type="tel"
                    value={formData.my_phone}
                    maxLength={20}
                    onChange={(e) => handleChange('my_phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                    placeholder="+1 (555) 123-4567"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Helps companions reach you via WhatsApp or phone call
                  </p>
                </div>

                {/* Email notice */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    📧 Your email <strong>({user?.email})</strong> will also be shared with companions when they contact you.
                  </p>
                </div>
              </div>
            </div>

            {/* Traveler Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Traveler Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Traveler's Name *
                  </label>
                  <input
                    type="text"
                    value={formData.traveler_name}
                    maxLength={30}
                    onChange={(e) => handleChange('traveler_name', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., Mom, Dad, Rajesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age (optional)
                  </label>
                  <input
                    type="number"
                    value={formData.traveler_age}
                    onChange={(e) => handleChange('traveler_age', e.target.value)}
                    min="18"
                    max="120"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., 68"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Hindi', 'English', 'Tamil', 'Telugu', 'Gujarati', 'Punjabi', 'Bengali', 'Marathi'].map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayItem('traveler_languages', lang)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          formData.traveler_languages.includes(lang)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Route */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Route</h2>
              
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Route</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <AirportAutocomplete
                    label="From (Origin)"
                    value={formData.origin}
                    onChange={(value) => handleChange('origin', value)}
                    placeholder="e.g., Delhi or DEL"
                    required
                  />

                  <AirportAutocomplete
                    label="To (Destination)"
                    value={formData.destination}
                    onChange={(value) => handleChange('destination', value)}
                    placeholder="e.g., San Francisco or SFO"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Booking Status */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Status</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="booking_status"
                      value="confirmed"
                      checked={formData.booking_status === 'confirmed'}
                      onChange={(e) => handleChange('booking_status', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Flight Already Booked</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="booking_status"
                      value="flexible"
                      checked={formData.booking_status === 'flexible'}
                      onChange={(e) => handleChange('booking_status', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Flexible Dates (Not Booked Yet)</span>
                  </label>
                </div>

                {formData.booking_status === 'confirmed' && (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Flight Date *
                      </label>
                      <input
                        type="date"
                        value={formData.flight_date}
                        onChange={(e) => handleChange('flight_date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Airline
                        </label>
                        <input
                          type="text"
                          value={formData.airline}
                          onChange={(e) => handleChange('airline', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                          placeholder="e.g., Air India, United"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Flight Number
                        </label>
                        <input
                          type="text"
                          value={formData.flight_number}
                          onChange={(e) => handleChange('flight_number', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                          placeholder="e.g., AI 173"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.booking_status === 'flexible' && (
                  <div className="space-y-4 bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      We'll show you who else is traveling on similar dates so you can coordinate bookings
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Earliest Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date_range_start}
                          onChange={(e) => handleChange('date_range_start', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latest Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date_range_end}
                          onChange={(e) => handleChange('date_range_end', e.target.value)}
                          min={formData.date_range_start || new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Companion Type */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What describes you best?</h2>
              
              <div className="space-y-3">
                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="companion_type"
                    value="need_companion"
                    checked={formData.companion_type === 'need_companion'}
                    onChange={(e) => handleChange('companion_type', e.target.value)}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900 text-lg">Need a Companion</span>
                    <p className="text-sm text-gray-600 mt-1">
                      My parent needs someone to help navigate the airport and travel with
                    </p>
                  </div>
                </label>

                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="companion_type"
                    value="willing_companion"
                    checked={formData.companion_type === 'willing_companion'}
                    onChange={(e) => handleChange('companion_type', e.target.value)}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900 text-lg">Willing to Help as Companion</span>
                    <p className="text-sm text-gray-600 mt-1">
                      I'm traveling on this route and happy to help an elderly traveler
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Help Needed */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Help Needed With</h2>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'wheelchair', label: 'Wheelchair/Mobility' },
                  { value: 'language', label: 'Language Barrier' },
                  { value: 'first_time', label: 'First Time Flying' },
                  { value: 'connecting_flight', label: 'Connecting Flights' },
                  { value: 'baggage', label: 'Baggage Help' },
                  { value: 'navigation', label: 'Airport Navigation' }
                ].map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleArrayItem('needs_help_with', item.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      formData.needs_help_with.includes(item.value)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                maxLength={100}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                placeholder="Any other information that would help find a good match..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Trip'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}