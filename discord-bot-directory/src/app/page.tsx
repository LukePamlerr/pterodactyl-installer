import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bot, Search, Star, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Amazing
              <span className="text-blue-600"> Discord Bots</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find the perfect Discord bots for your server. Browse our comprehensive directory with reviews, ratings, and detailed information to enhance your Discord experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/bots">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Bots
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/submit">
                  <Bot className="mr-2 h-5 w-5" />
                  Submit Your Bot
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Bots</h3>
              <p className="text-gray-600">
                All bots are verified and tested to ensure quality and security for your server.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Reviews</h3>
              <p className="text-gray-600">
                Read authentic reviews from real users to make informed decisions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">
                One-click invites and detailed setup guides for quick bot integration.
              </p>
            </div>
          </div>
        </div>

        <div className="py-16 bg-white rounded-2xl shadow-lg mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Bots</h2>
            <p className="text-gray-600">Check out some of the most popular Discord bots</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 rounded-full w-12 h-12 mr-3"></div>
                  <div>
                    <h3 className="font-semibold">Featured Bot {i}</h3>
                    <p className="text-sm text-gray-600">Moderation</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Advanced moderation features with custom commands and automation.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm ml-1">4.8</span>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/bots">View All Bots</Link>
            </Button>
          </div>
        </div>

        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of Discord servers using our directory to find the perfect bots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/bots">Explore Bots</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/submit">Submit Your Bot</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
