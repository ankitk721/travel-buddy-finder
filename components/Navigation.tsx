// In Navigation.tsx, update the links to show active state

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Travel Buddy Finder
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/trips" 
            className={`text-gray-700 hover:text-indigo-600 font-medium ${
              isActive('/trips') ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : ''
            }`}
          >
            Browse Trips
          </Link>
          
          {user && (
            <>
              <Link 
                href="/my-trips" 
                className={`text-gray-700 hover:text-indigo-600 font-medium ${
                  isActive('/my-trips') ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : ''
                }`}
              >
                My Trips
              </Link>
              <Link
                href="/trips/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                + Post Trip
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Signed in as<br />
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-indigo-600 underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Login
            </Link>
          )}

          <Link
            href="/privacy"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </nav>
  )
}