'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    setMobileMenuOpen(false)
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  // Shorten email for display
  const getShortEmail = (email: string) => {
    if (!email) return ''
    const [username, domain] = email.split('@')
    if (username.length > 12) {
      return `${username.substring(0, 12)}...@${domain}`
    }
    return email
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 flex-shrink-0">
            Travel Buddy Finder
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-primary-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/trips" 
              className={`text-stone-700 hover:text-primary-600 font-medium transition ${
                isActive('/trips') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : ''
              }`}
            >
              Browse Trips
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/my-trips" 
                  className={`text-stone-700 hover:text-primary-600 font-medium transition ${
                    isActive('/my-trips') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : ''
                  }`}
                >
                  My Trips
                </Link>
                <Link
                  href="/trips/new"
                  className="text-primary-600 hover:text-primary-700 font-semibold border-2 border-primary-600 px-4 py-1.5 rounded-lg hover:bg-primary-50 transition whitespace-nowrap"
                >
                  + Post Trip
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4 border-l border-stone-200 pl-6 ml-2">
                <span className="text-sm text-stone-500 max-w-[14rem] truncate" title={user.email}>
                  {getShortEmail(user.email)}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-stone-600 hover:text-primary-700 text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-stone-700 hover:text-primary-700 font-medium transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            <Link 
              href="/trips" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-3 rounded-lg hover:bg-primary-50 transition ${
                isActive('/trips') ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-stone-700'
              }`}
            >
              Browse Trips
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/my-trips" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg hover:bg-primary-50 transition ${
                    isActive('/my-trips') ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-stone-700'
                  }`}
                >
                  My Trips
                </Link>
                <Link 
                  href="/trips/new" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 bg-primary-600 text-white rounded-lg text-center font-semibold hover:bg-primary-700 transition"
                >
                  + Post a Trip
                </Link>
              </>
            )}

            {user ? (
              <div className="pt-3 border-t space-y-2">
                <div className="px-3 py-2 bg-stone-50 rounded-lg">
                  <div className="text-xs text-stone-500 mb-1">Signed in as</div>
                  <div className="text-sm text-stone-700 font-medium break-all">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-center text-stone-700 hover:bg-stone-100 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 text-stone-700 hover:bg-stone-100 rounded-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}