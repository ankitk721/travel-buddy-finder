// app/privacy/page.tsx
import Navigation from '@/components/Navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Travel Buddy Finder',
  description: 'Privacy Policy for Travel Buddy Finder',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-indigo max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Travel Buddy Finder ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and share information when you use 
                our service.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>Key Point:</strong> We are a free, community-focused platform. We do not sell 
                your data, show ads, or use your information for anything other than connecting families.
              </p>
            </section>

            {/* What We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Account Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Email address:</strong> Required for account creation and login</li>
                <li><strong>Password:</strong> Encrypted and securely stored</li>
                <li><strong>Authentication data:</strong> If you sign up with Google OAuth</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Trip Information (User-Provided)</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Your name:</strong> The person posting the trip</li>
                <li><strong>Your phone number:</strong> For coordination purposes</li>
                <li><strong>Your email:</strong> Already collected from account creation</li>
                <li><strong>Traveler details:</strong> Name, age, languages spoken</li>
                <li><strong>Travel details:</strong> Origin, destination, dates, booking status</li>
                <li><strong>Companion preferences:</strong> Type of companion sought, assistance needed</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Automatically Collected</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Usage data:</strong> Pages visited, actions taken</li>
                <li><strong>Device information:</strong> Browser type, IP address (anonymized)</li>
                <li><strong>Timestamps:</strong> When you create or update trips</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Create and manage your account</li>
                <li>Display your trip posts to other logged-in users</li>
                <li>Enable families to contact you for coordination</li>
                <li>Send important service updates (account verification, security alerts)</li>
                <li>Improve our service and fix bugs</li>
                <li>Prevent fraud and abuse</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>We do NOT:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Sell your data to third parties</li>
                <li>Use your data for advertising</li>
                <li>Share your information with anyone except as described in this policy</li>
                <li>Send marketing emails (we don't even have a newsletter)</li>
              </ul>
            </section>

            {/* Who Can See Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Who Can See Your Information</h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-gray-800 font-medium">
                  <strong>Important:</strong> Your contact information (email and phone) is visible to 
                  logged-in, verified users when they view your trip posts.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Logged-In Users</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                When you post a trip, the following is visible to authenticated users:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Your name and contact information (email, phone)</li>
                <li>Traveler details (name, age, languages)</li>
                <li>Travel route and dates</li>
                <li>Companion preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">NOT Visible to Public</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Your information is NOT shown to visitors without an account</li>
                <li>Your trips are NOT indexed by search engines</li>
                <li>Only users who create an account and verify their email can see contact details</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Service Providers</h3>
              <p className="text-gray-700 leading-relaxed">
                We use trusted third-party services to operate our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li><strong>Supabase:</strong> Database and authentication (enterprise-grade security)</li>
                <li><strong>Vercel:</strong> Website hosting</li>
                <li><strong>Google:</strong> OAuth authentication (if you sign in with Google)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                These providers have access to data only as necessary to perform their services and are 
                bound by confidentiality agreements.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We take reasonable measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Encryption:</strong> All data is transmitted over HTTPS (SSL/TLS)</li>
                <li><strong>Password protection:</strong> Passwords are hashed and never stored in plain text</li>
                <li><strong>Access controls:</strong> Row Level Security (RLS) in our database</li>
                <li><strong>Regular updates:</strong> We keep our systems up to date with security patches</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                However, no method of transmission over the internet is 100% secure. You use our service 
                at your own risk.
              </p>
            </section>

            {/* Your Rights & Choices */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Rights & Choices</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Access & Update</h3>
              <p className="text-gray-700 leading-relaxed">
                You can view and update your trip posts anytime from your "My Trips" dashboard.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Delete Your Data</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Delete individual trips:</strong> Use the delete button on "My Trips" page</li>
                <li><strong>Delete your account:</strong> Email us at support@travel-buddy-finder.com and 
                we'll delete all your data within 48 hours</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Opt-Out of Emails</h3>
              <p className="text-gray-700 leading-relaxed">
                We only send essential emails (account verification, security alerts). You cannot opt out 
                of these as they're necessary for the service to function.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Active trips:</strong> Retained until you delete them or mark them complete</li>
                <li><strong>Completed trips:</strong> Retained for 30 days, then automatically deleted</li>
                <li><strong>Account data:</strong> Retained until you request deletion</li>
                <li><strong>Logs:</strong> Anonymized usage logs retained for 90 days for security purposes</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is not intended for children under 18. We do not knowingly collect personal 
                information from minors. If you believe a minor has provided us information, please contact 
                us immediately.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. International Users</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is operated from the United States. If you're accessing from outside the US, 
                your information may be transferred to and processed in the US, which may have different 
                data protection laws than your country.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We'll notify you of significant changes 
                by updating the "Last Updated" date. Continued use after changes constitutes acceptance.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have questions about this Privacy Policy or want to exercise your rights, contact us at:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:support@travel-buddy-finder.com" className="text-indigo-600 hover:underline">
                  support@travel-buddy-finder.com
                </a>
              </p>
              <p className="text-gray-700 mt-3">
                Or visit our <Link href="/contact" className="text-indigo-600 hover:underline">Contact Us</Link> page.
              </p>
            </section>

            {/* Summary */}
            <section className="border-t pt-6 mt-8 bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy Policy Summary</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ We collect only what's needed to connect families</li>
                <li>✓ Your contact info is visible only to logged-in users</li>
                <li>✓ We never sell your data or show ads</li>
                <li>✓ You can delete your data anytime</li>
                <li>✓ We use enterprise-grade security (Supabase)</li>
                <li>✓ Free service, no hidden monetization</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}