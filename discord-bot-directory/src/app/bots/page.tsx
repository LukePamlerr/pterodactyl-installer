'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bot, Star, Users, ExternalLink, Search, Filter } from 'lucide-react'
import Link from 'next/link'

interface BotData {
  id: string
  applicationId: string
  name: string
  description: string
  avatar?: string
  tags: string[]
  votes: number
  serverCount?: number
  status: string
  approved: boolean
  featured: boolean
  inviteUrl: string
  createdAt?: string
}

export default function BotsPage() {
  const { data: session } = useSession()
  const [bots, setBots] = useState<BotData[]>([])
  const [filteredBots, setFilteredBots] = useState<BotData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [sortBy, setSortBy] = useState('votes')
  const [loading, setLoading] = useState(true)

  const tags = ['moderation', 'music', 'fun', 'utility', 'gaming', 'economy', 'roleplay', 'anime']

  useEffect(() => {
    fetchBots()
  }, [])

  useEffect(() => {
    filterAndSortBots()
  }, [bots, searchTerm, selectedTag, sortBy])

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/bots')
      if (response.ok) {
        const data = await response.json()
        setBots(data)
      }
    } catch (error) {
      console.error('Error fetching bots:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortBots = () => {
    let filtered = bots.filter(bot => bot.approved)

    if (searchTerm) {
      filtered = filtered.filter(bot =>
        bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bot.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter(bot =>
        bot.tags.includes(selectedTag)
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return b.votes - a.votes
        case 'servers':
          return (b.serverCount || 0) - (a.serverCount || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        default:
          return 0
      }
    })

    setFilteredBots(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'OFFLINE': return 'bg-red-500'
      case 'MAINTENANCE': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bots...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Discord Bots</h1>
          <p className="text-gray-600 mb-6">Discover amazing bots to enhance your Discord server</p>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bots..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="votes">Most Voted</SelectItem>
                  <SelectItem value="servers">Most Servers</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map((bot) => (
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
                      {bot.featured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
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
                  <Button asChild className="flex-1">
                    <Link href={`/bots/${bot.applicationId}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={bot.inviteUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBots.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bots found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
