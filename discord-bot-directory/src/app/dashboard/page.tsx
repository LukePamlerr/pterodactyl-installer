'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Plus, Eye, Edit, Trash2, Users, Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface UserBot {
  id: string
  applicationId: string
  name: string
  description: string
  tags: string[]
  votes: number
  serverCount?: number
  status: string
  approved: boolean
  featured: boolean
  inviteUrl: string
  createdAt: string
  reviews: any[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userBots, setUserBots] = useState<UserBot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchUserBots()
    }
  }, [status, router])

  const fetchUserBots = async () => {
    try {
      const response = await fetch('/api/user/bots')
      if (response.ok) {
        const data = await response.json()
        setUserBots(data)
      }
    } catch (error) {
      console.error('Error fetching user bots:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'OFFLINE': return 'bg-red-500'
      case 'MAINTENANCE': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (approved: boolean, status: string) => {
    if (!approved) return 'Pending Approval'
    return status
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600">
            Manage your Discord bots and track their performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bots</p>
                  <p className="text-2xl font-bold text-gray-900">{userBots.length}</p>
                </div>
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userBots.reduce((acc, bot) => acc + bot.votes, 0)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Servers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userBots.reduce((acc, bot) => acc + (bot.serverCount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Bots</h2>
          <Button asChild>
            <Link href="/submit">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Bot
            </Link>
          </Button>
        </div>

        {userBots.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bots yet</h3>
              <p className="text-gray-600 mb-4">
                Submit your first Discord bot to get started
              </p>
              <Button asChild>
                <Link href="/submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Bot
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBots.map((bot) => (
              <Card key={bot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(bot.status)}`}></div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{bot.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={bot.approved ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {getStatusText(bot.approved, bot.status)}
                          </Badge>
                          {bot.featured && (
                            <Badge variant="outline" className="text-xs">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{bot.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bot.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {bot.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{bot.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        {bot.votes}
                      </div>
                      {bot.serverCount && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {bot.serverCount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link href={`/bots/${bot.applicationId}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={bot.inviteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
