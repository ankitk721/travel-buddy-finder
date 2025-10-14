// app/contact/page.tsx
import Navigation from '@/components/Navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Us | Travel Buddy Finder',
  description: 'Get in touch with Travel Buddy Finder team for support, feedback, or questions.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-8">
            We'd love to hear from you! Whether you have questions, feedback, or need help, 
            we're here to assist.
          </p>

          {/* Contact Methods */}
          <div className="space-y-6 mb-12">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600 mb-2">
                  For general inquiries, support, or feedback
                </p>
                <a 
                  href="mailto:support@travel-buddy-finder.com" 
                  className="text-indigo-600 hover:underline font-medium"
                >
                  support@travel-buddy-finder.com
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Response Time</h3>
                <p className="text-gray-600">
                  We typically respond within 24-48 hours (usually faster!)
                </p>
              </div>
            </div>
          </div>

          {/* Common Questions */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I delete my account?</h3>
                <p className="text-gray-600">
                  You can delete your trips from the "My Trips" page. To delete your account entirely, 
                  please email us and we'll remove all your data within 48 hours.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I report abuse or spam?</h3>
                <p className="text-gray-600">
                  Email us immediately at support@travel-buddy-finder.com with details. 
                  We take abuse seriously and will investigate promptly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is this service really free?</h3>
                <p className="text-gray-600">
                  Yes! Travel Buddy Finder is completely free and will always be. We built this to help 
                  our community, not to make money.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">I have a feature request or feedback</h3>
                <p className="text-gray-600">
                  We'd love to hear it! Email us your suggestions. We're actively improving the platform 
                  based on user feedback.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t pt-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">More Information</h2>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/privacy" 
                className="text-indigo-600 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                href="/terms" 
                className="text-indigo-600 hover:underline font-medium"
              >
                Terms of Service
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                href="/trips" 
                className="text-indigo-600 hover:underline font-medium"
              >
                Browse Trips
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}