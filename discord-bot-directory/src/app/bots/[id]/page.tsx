'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bot, Star, Users, ExternalLink, ThumbsUp, ThumbsDown, MessageSquare, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface BotDetails {
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
  website?: string
  support?: string
  github?: string
  prefix?: string
  createdAt: string
  reviews: Review[]
}

interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  user: {
    id: string
    name?: string
    image?: string
  }
}

export default function BotDetailsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [bot, setBot] = useState<BotDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  const applicationId = params.id as string

  useEffect(() => {
    fetchBotDetails()
  }, [applicationId])

  const fetchBotDetails = async () => {
    try {
      const response = await fetch(`/api/bots/${applicationId}`)
      if (response.ok) {
        const data = await response.json()
        setBot(data)
      } else {
        setError('Bot not found')
      }
    } catch (err) {
      setError('Failed to load bot details')
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !bot) return

    setSubmittingReview(true)
    setError('')

    try {
      const response = await fetch(`/api/bots/${applicationId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      })

      if (response.ok) {
        setReviewSuccess(true)
        setReviewComment('')
        setReviewRating(5)
        fetchBotDetails()
        setTimeout(() => setReviewSuccess(false), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit review')
      }
    } catch (err) {
      setError('Failed to submit review')
    } finally {
      setSubmittingReview(false)
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

  const averageRating = bot?.reviews.length 
    ? bot.reviews.reduce((acc, review) => acc + review.rating, 0) / bot.reviews.length 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !bot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bot Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'This bot could not be found.'}</p>
            <Button asChild>
              <Link href="/bots">Browse Bots</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="h-10 w-10 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(bot.status)}`}></div>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
                      {bot.featured && (
                        <Badge variant="secondary" className="mt-1">Featured</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild>
                      <a href={bot.inviteUrl} target="_blank" rel="noopener noreferrer">
                        Invite Bot
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {bot.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>

                <p className="text-gray-700 mb-6">{bot.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
                      <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{bot.reviews.length} reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <ThumbsUp className="h-5 w-5 text-blue-500 mr-1" />
                      <span className="text-lg font-semibold">{bot.votes}</span>
                    </div>
                    <p className="text-sm text-gray-600">votes</p>
                  </div>
                  {bot.serverCount && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-5 w-5 text-green-500 mr-1" />
                        <span className="text-lg font-semibold">{bot.serverCount.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">servers</p>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.status)} mr-1`}></div>
                      <span className="text-lg font-semibold">{bot.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">status</p>
                  </div>
                </div>

                {(bot.website || bot.support || bot.github) && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {bot.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={bot.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                      {bot.support && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={bot.support} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Support
                          </a>
                        </Button>
                      )}
                      {bot.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={bot.github} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews ({bot.reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {session && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Write a Review</h3>
                    <form onSubmit={submitReview} className="space-y-4">
                      <div>
                        <Label>Rating</Label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1"
                            >
                              <Star 
                                className={`h-6 w-6 ${star <= reviewRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="comment">Comment (optional)</Label>
                        <Textarea
                          id="comment"
                          placeholder="Share your experience with this bot..."
                          value={reviewComment}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewComment(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button type="submit" disabled={submittingReview}>
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </form>
                    {reviewSuccess && (
                      <Alert className="mt-4 border-green-200 bg-green-50">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Review submitted successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {bot.reviews.map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            {review.user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold">{review.user.name || 'Anonymous'}</p>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 ml-13">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>

                {bot.reviews.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No reviews yet. Be the first to review this bot!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application ID</span>
                    <span className="font-mono text-sm">{bot.applicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prefix</span>
                    <span className="font-mono">{bot.prefix || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Added</span>
                    <span>{new Date(bot.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)} mr-2`}></div>
                      <span>{bot.status}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!session && (
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-gray-600 mb-4">Sign in to review this bot</p>
                  <Button asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
