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

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600 flex-shrink-0">
            Travel Buddy Finder
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              // X icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link 
              href="/trips" 
              className={`text-gray-700 hover:text-indigo-600 font-medium transition ${
                isActive('/trips') ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : ''
              }`}
            >
              Browse Trips
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/my-trips" 
                  className={`text-gray-700 hover:text-indigo-600 font-medium transition ${
                    isActive('/my-trips') ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : ''
                  }`}
                >
                  My Trips
                </Link>
                <Link
                  href="/trips/new"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium whitespace-nowrap"
                >
                  + Post Trip
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Signed in as</div>
                  <div className="text-sm text-gray-700 font-medium truncate max-w-[150px] lg:max-w-[200px]">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-indigo-600 underline text-sm"
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
              href="/contact"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Privacy
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            <Link 
              href="/trips" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-3 rounded-lg hover:bg-indigo-50 transition ${
                isActive('/trips') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Browse Trips
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/my-trips" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg hover:bg-indigo-50 transition ${
                    isActive('/my-trips') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  My Trips
                </Link>
                <Link 
                  href="/trips/new" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 bg-indigo-600 text-white rounded-lg text-center font-semibold hover:bg-indigo-700 transition"
                >
                  + Post a Trip
                </Link>
              </>
            )}

            {user ? (
              <div className="pt-3 border-t space-y-2">
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Signed in as</div>
                  <div className="text-sm text-gray-700 font-medium break-all">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Login
              </Link>
            )}

            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-gray-500 hover:bg-gray-100 rounded-lg transition text-sm"
            >
              Privacy Policy
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}