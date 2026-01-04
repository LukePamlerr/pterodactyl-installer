export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Welcome to the Discord Bot Directory. By using our service, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using the Discord Bot Directory, you accept and agree to be bound by the terms of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Bot Submission Guidelines</h2>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>You must be the owner or have permission from the bot owner to submit the bot</li>
              <li>Bots must not violate Discord's Terms of Service</li>
              <li>Bots must be functional and provide value to users</li>
              <li>Bots must not contain malicious code, viruses, or harmful content</li>
              <li>Bots must not engage in spam, scam, or fraudulent activities</li>
              <li>Bots must respect user privacy and data protection laws</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Conduct</h2>
            <p className="text-gray-600 mb-4">
              Users of the Discord Bot Directory agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Provide accurate and truthful information when submitting bots</li>
              <li>Not submit bots that contain inappropriate or offensive content</li>
              <li>Not attempt to manipulate ratings or reviews</li>
              <li>Respect other users and maintain a positive community</li>
              <li>Not attempt to exploit or harm the service in any way</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              You retain ownership of any intellectual property rights in your bots. By submitting a bot, you grant us a non-exclusive, worldwide, royalty-free license to display, promote, and distribute information about your bot on our platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Privacy and Data</h2>
            <p className="text-gray-600 mb-4">
              We collect and use data in accordance with our Privacy Policy. We do not sell or share your personal information with third parties for marketing purposes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Service Availability</h2>
            <p className="text-gray-600 mb-4">
              We strive to maintain the service but do not guarantee uninterrupted availability. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Content Moderation</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to review, approve, or remove any bot submission at our sole discretion. We may remove bots that violate these terms or are reported for inappropriate behavior.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              The Discord Bot Directory is provided "as is" without any warranties, expressed or implied. We do not guarantee the accuracy, reliability, or functionality of any bots listed on our platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of any changes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms of Service, please contact us at support@botdirectory.com
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: January 3, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
