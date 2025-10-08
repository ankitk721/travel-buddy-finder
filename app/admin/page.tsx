'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type ContactLog = {
  id: string
  created_at: string
  contact_method: string
  contacted_by_name: string
  contacted_by_email: string
  trip_owner_name: string
  traveler_name: string
  origin: string
  destination: string
}

type Stats = {
  total_contacts: number
  whatsapp_count: number
  phone_count: number
  email_copy_count: number
  email_send_count: number
  unique_contactors: number
}

export default function AdminPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactLog[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      router.push('/')
      return
    }
    
    setAuthorized(true)
    fetchData()
  }

  const fetchData = async () => {
    const { data: contactData } = await supabase.rpc('get_contact_logs')
    
    if (contactData) {
      setContacts(contactData)
    }

    const { data: statsData } = await supabase.rpc('get_contact_stats')
    
    if (statsData && statsData.length > 0) {
      setStats(statsData[0])
    }

    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getMethodBadge = (method: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      'whatsapp': { label: '💬 WhatsApp', color: 'bg-green-100 text-green-800' },
      'phone': { label: '📞 Phone', color: 'bg-blue-100 text-blue-800' },
      'email_copy': { label: '📋 Copy Email', color: 'bg-purple-100 text-purple-800' },
      'email_send': { label: '✉️ Send Email', color: 'bg-indigo-100 text-indigo-800' }
    }
    const badge = badges[method] || { label: method, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  if (loading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Checking authorization...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-1">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_contacts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-1">WhatsApp</p>
              <p className="text-3xl font-bold text-green-600">{stats.whatsapp_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-1">Phone Calls</p>
              <p className="text-3xl font-bold text-blue-600">{stats.phone_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-1">Emails</p>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.email_copy_count + stats.email_send_count}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-1">Unique Users</p>
              <p className="text-3xl font-bold text-purple-600">{stats.unique_contactors}</p>
            </div>
          </div>
        )}

        {/* Contact Logs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Contacts</h2>
          </div>
          
          {contacts.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              No contacts yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacted By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(contact.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getMethodBadge(contact.contact_method)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{contact.contacted_by_name}</p>
                          <p className="text-gray-500">{contact.contacted_by_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{contact.traveler_name}</p>
                          <p className="text-gray-500">by {contact.trip_owner_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.origin} → {contact.destination}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}