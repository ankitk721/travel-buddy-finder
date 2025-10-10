import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Information We Share</h2>
              <p>
                When you post a trip, the following information is visible to other registered users:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Your name</li>
                <li>Your email address</li>
                <li>Your phone number (if provided)</li>
                <li>Travel details (route, dates, notes)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Who Can See Your Information</h2>
              <p>
                Only registered, logged-in users can view contact information. We do not share your information with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Control</h2>
              <p>
                You can delete your trips at any time from the "My Trips" page. You can also delete your account by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Safety</h2>
              <p>
                Please use common sense when sharing information and meeting people. We recommend:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Video call before meeting in person</li>
                <li>Meet in public airport spaces</li>
                <li>Trust your instincts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h2>
              <p>
                Questions about privacy? Email us at: <strong>privacy@travel-buddy-finder.com</strong>
              </p>
              <p>
                For anything else email us at: <strong>admin@travel-buddy-finder.com</strong>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}