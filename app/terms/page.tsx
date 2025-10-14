// app/terms/page.tsx
import Navigation from '@/components/Navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Travel Buddy Finder',
  description: 'Terms of Service for Travel Buddy Finder',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-indigo max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Travel Buddy Finder ("we," "our," or "us"). By accessing or using our website 
                and services, you agree to be bound by these Terms of Service. If you do not agree to these 
                terms, please do not use our service.
              </p>
            </section>

            {/* What This Service Is */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. What This Service Is</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Travel Buddy Finder is a free platform that helps families find travel companions for elderly 
                parents on India-US routes. We provide a bulletin board where users can:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Post travel plans including dates, routes, and contact information</li>
                <li>Browse other users' travel plans</li>
                <li>Contact other families directly for coordination</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>We are NOT:</strong> A travel agency, booking service, background check service, 
                or guarantor of any arrangements made between users.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                By using Travel Buddy Finder, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and truthful information in your trip posts</li>
                <li>Only post travel plans for yourself or family members with their consent</li>
                <li>Understand that your contact information will be visible to logged-in users</li>
                <li>Use the service only for finding legitimate travel companions</li>
                <li>Treat other users with respect and courtesy</li>
                <li>Take full responsibility for any arrangements you make with other users</li>
              </ul>
            </section>

            {/* Prohibited Uses */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Prohibited Uses</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You may NOT use Travel Buddy Finder to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Spam or harass:</strong> Contact users excessively or inappropriately</li>
                <li><strong>Scrape data:</strong> Use automated tools to collect user information</li>
                <li><strong>Commercial use:</strong> Use contact information for telemarketing, advertising, or sales</li>
                <li><strong>Fraudulent activity:</strong> Post false information or impersonate others</li>
                <li><strong>Illegal purposes:</strong> Violate any local, state, or federal laws</li>
                <li><strong>Harm others:</strong> Threaten, stalk, or abuse other users</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>Violation of these terms will result in immediate account termination and may be 
                reported to authorities.</strong>
              </p>
            </section>

            {/* Contact Information & Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Contact Information & Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                When you post a trip, you voluntarily share your contact information (email and phone) with 
                other logged-in users. By posting, you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Consent to your information being visible to authenticated users</li>
                <li>Understand we cannot control how others use your contact information</li>
                <li>Acknowledge you can delete your trips and account at any time</li>
                <li>Agree to our <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link></li>
              </ul>
            </section>

            {/* Account Management */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Account Management</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>USE AT YOUR OWN RISK.</strong> Travel Buddy Finder is provided "AS IS" without 
                warranties of any kind. We do not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Verify the identity or background of users</li>
                <li>Guarantee the accuracy of information posted</li>
                <li>Endorse or recommend any specific users or arrangements</li>
                <li>Accept liability for interactions between users</li>
                <li>Guarantee the service will be uninterrupted or error-free</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, Travel Buddy Finder and its creators shall not be 
                liable for any damages arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Use or inability to use the service</li>
                <li>Interactions with other users</li>
                <li>Unauthorized access to your data</li>
                <li>Any travel arrangements or incidents</li>
                <li>Errors or inaccuracies in content</li>
              </ul>
            </section>

            {/* User Conduct & Safety */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. User Safety</h2>
              <p className="text-gray-700 leading-relaxed">
                We strongly recommend:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Video call with potential companions before travel</li>
                <li>Share your travel plans with family members</li>
                <li>Meet in public areas at airports</li>
                <li>Trust your instincts - if something feels wrong, don't proceed</li>
                <li>Report suspicious behavior to us immediately</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms of Service from time to time. Continued use of the service after 
                changes constitutes acceptance of the new terms. We will update the "Last Updated" date at 
                the top of this page.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms shall be governed by the laws of the State of Washington, United States, 
                without regard to conflict of law provisions.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700 mt-3">
                <a href="mailto:support@travel-buddy-finder.com" className="text-indigo-600 hover:underline font-medium">
                  support@travel-buddy-finder.com
                </a>
              </p>
              <p className="text-gray-700 mt-3">
                Or visit our <Link href="/contact" className="text-indigo-600 hover:underline">Contact Us</Link> page.
              </p>
            </section>

            {/* Acceptance */}
            <section className="border-t pt-6 mt-8">
              <p className="text-gray-700 leading-relaxed font-medium">
                By using Travel Buddy Finder, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}