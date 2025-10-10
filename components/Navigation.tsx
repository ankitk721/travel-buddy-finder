'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
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
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
          Travel Buddy Finder
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                href="/trips" 
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Browse Trips
              </Link>
              <Link 
                href="/my-trips" 
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                My Trips
              </Link>
              <Link 
                href="/trips/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition"
              >
                + Post Trip
              </Link>
              
              {/* User Email Display */}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-300">
                <div className="text-sm">
                  <p className="text-gray-500">Signed in as</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="text-gray-600 hover:text-gray-900 text-sm underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/trips" 
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Browse Trips
              </Link>
              <Link 
                href="/login" 
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Log In
              </Link>
              <Link 
                href="/signup" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* In Navigation.tsx or at bottom of pages */}
        <div className="text-center text-sm text-gray-500 py-4">
            <Link href="/privacy" className="hover:text-gray-700 underline">
                Privacy Policy
            </Link>
        </div>
      </div>
    </nav>
  )
}