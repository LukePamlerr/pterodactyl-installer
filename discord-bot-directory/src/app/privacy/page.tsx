export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              This Privacy Policy describes how Discord Bot Directory collects, uses, and protects your information when you use our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Discord user ID, username, and avatar (via OAuth)</li>
              <li>Email address (optional, with your consent)</li>
              <li>Bot submissions and associated metadata</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Usage Data</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Pages visited and time spent on our site</li>
              <li>Bot interactions and reviews</li>
              <li>IP address and browser information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To authenticate users and prevent unauthorized access</li>
              <li>To process and display bot submissions</li>
              <li>To enable user reviews and ratings</li>
              <li>To improve our service and user experience</li>
              <li>To respond to user inquiries and support requests</li>
              <li>To detect and prevent fraudulent activities</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, rent, or trade your personal information. We may share information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights, property, or safety</li>
              <li>With trusted service providers who assist in operating our service</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure hosting infrastructure</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your experience, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Authentication cookies to keep you logged in</li>
              <li>Analytics cookies to understand site usage</li>
              <li>Preference cookies to remember your settings</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Third-Party Services</h2>
            <p className="text-gray-600 mb-4">
              Our service integrates with Discord and may use third-party services for:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>User authentication via Discord OAuth</li>
              <li>Bot validation through Discord API</li>
              <li>Analytics and monitoring services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of non-essential data collection</li>
              <li>Request data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We retain your information only as long as necessary to provide our service and comply with legal obligations. You may request deletion of your account and associated data at any time.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete the information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-600 mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify users of significant changes via email or prominent notice on our site.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Email: privacy@botdirectory.com</li>
              <li>Discord: Support Server</li>
            </ul>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
