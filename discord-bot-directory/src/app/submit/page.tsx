'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bot, Check, X, ExternalLink, AlertCircle } from 'lucide-react'
import { validateDiscordBot, discordAPI } from '@/lib/discord'

interface FormData {
  applicationId: string
  name: string
  description: string
  prefix: string
  website: string
  support: string
  github: string
  tags: string[]
}

export default function SubmitBotPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    applicationId: '',
    name: '',
    description: '',
    prefix: '',
    website: '',
    support: '',
    github: '',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [botValidation, setBotValidation] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const availableTags = [
    'moderation', 'music', 'fun', 'utility', 'gaming', 'economy', 
    'roleplay', 'anime', 'social', 'logging', 'automod', 'custom'
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const validateBot = async () => {
    if (!formData.applicationId) return

    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('/api/validate-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId: formData.applicationId }),
      })

      if (response.ok) {
        const data = await response.json()
        setBotValidation(data)
        setFormData(prev => ({
          ...prev,
          name: data.name || prev.name,
          description: data.description || prev.description,
        }))
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to validate bot')
        setBotValidation(null)
      }
    } catch (err) {
      setError('Failed to validate bot')
      setBotValidation(null)
    } finally {
      setIsValidating(false)
    }
  }

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !botValidation) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedBy: session.user.id,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit bot')
      }
    } catch (err) {
      setError('Failed to submit bot')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bot Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Your bot has been submitted for review. We'll notify you once it's approved.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit Your Discord Bot</h1>
          <p className="text-gray-600">
            Share your Discord bot with our community. Fill out the form below to get started.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                Bot Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="applicationId">Discord Application ID *</Label>
                <div className="flex gap-2">
                  <Input
                    id="applicationId"
                    type="text"
                    placeholder="Enter your Discord Application ID"
                    value={formData.applicationId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, applicationId: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    onClick={validateBot}
                    disabled={!formData.applicationId || isValidating}
                    variant="outline"
                  >
                    {isValidating ? 'Validating...' : 'Validate'}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Find this in your Discord Developer Portal
                </p>
              </div>

              {botValidation && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Bot Validated Successfully!</span>
                  </div>
                  <div className="text-sm text-green-700">
                    <p><strong>Name:</strong> {botValidation.name}</p>
                    <p><strong>Description:</strong> {botValidation.description}</p>
                    {botValidation.icon && (
                      <div className="mt-2">
                        <img 
                          src={`https://cdn.discordapp.com/app-icons/${botValidation.id}/${botValidation.icon}.png`}
                          alt="Bot Icon"
                          className="w-16 h-16 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="name">Bot Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter bot name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your bot's features and functionality"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 50 characters, maximum 1000 characters
                </p>
              </div>

              <div>
                <Label htmlFor="prefix">Command Prefix</Label>
                <Input
                  id="prefix"
                  type="text"
                  placeholder="! or / or any prefix"
                  value={formData.prefix}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, prefix: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <X 
                        className="h-3 w-3 ml-1" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.filter(tag => !formData.tags.includes(tag)).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => addTag(tag)}
                    >
                      + {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Select up to 10 tags that describe your bot
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourbot.com"
                  value={formData.website}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="support">Support Server Invite</Label>
                <Input
                  id="support"
                  type="url"
                  placeholder="https://discord.gg/yourserver"
                  value={formData.support}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, support: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="github">GitHub Repository</Label>
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/username/bot"
                  value={formData.github}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!botValidation || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bot'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
