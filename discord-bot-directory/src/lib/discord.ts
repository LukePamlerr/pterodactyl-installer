import axios from 'axios'

const DISCORD_API_BASE = 'https://discord.com/api/v10'

export interface DiscordBot {
  id: string
  applicationId: string
  name: string
  description: string
  icon: string | null
  owner: {
    id: string
    username: string
    discriminator: string
  }
  team: any | null
  bot_public: boolean
  bot_require_code_grant: boolean
  verify_key: string
}

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  verified?: boolean
}

class DiscordAPI {
  private accessToken: string | null = null

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.accessToken) {
      throw new Error('No access token provided')
    }

    const url = `${DISCORD_API_BASE}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Discord API error: ${response.status} - ${error.message || 'Unknown error'}`)
    }

    return response.json()
  }

  async getCurrentUser(): Promise<DiscordUser> {
    return this.request('/users/@me')
  }

  async getUserGuilds() {
    return this.request('/users/@me/guilds')
  }

  async getApplication(applicationId: string): Promise<DiscordBot> {
    return this.request(`/applications/${applicationId}`)
  }

  async getBotInfo(botId: string): Promise<DiscordBot> {
    return this.request(`/users/${botId}`)
  }

  async getBotGuilds(botId: string) {
    return this.request(`/users/${botId}/guilds`)
  }

  async inviteBot(applicationId: string, permissions: number = 8) {
    const scopes = ['bot', 'applications.commands']
    const params = new URLSearchParams({
      client_id: applicationId,
      permissions: permissions.toString(),
      scope: scopes.join(' '),
    })
    return `https://discord.com/oauth2/authorize?${params.toString()}`
  }

  async validateBotOwnership(applicationId: string, userId: string): Promise<boolean> {
    try {
      const application = await this.getApplication(applicationId)
      
      if (application.owner && application.owner.id === userId) {
        return true
      }
      
      if (application.team && application.team.members.some((member: any) => member.user.id === userId && (member.role === 'admin' || member.role === 'owner'))) {
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error validating bot ownership:', error)
      return false
    }
  }

  async getBotInviteUrl(applicationId: string, permissions: number = 8): Promise<string> {
    const scopes = ['bot', 'applications.commands']
    const params = new URLSearchParams({
      client_id: applicationId,
      permissions: permissions.toString(),
      scope: scopes.join(' '),
    })
    return `https://discord.com/oauth2/authorize?${params.toString()}`
  }
}

export const discordAPI = new DiscordAPI()

export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user')
  }

  return response.json()
}

export async function validateDiscordBot(applicationId: string, userId: string): Promise<DiscordBot | null> {
  try {
    const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return null
    }

    const botData = await response.json()
    
    const isOwner = botData.owner?.id === userId
    const isTeamMember = botData.team?.members?.some((member: any) => 
      member.user.id === userId && (member.role === 'admin' || member.role === 'owner')
    )

    if (!isOwner && !isTeamMember) {
      return null
    }

    return botData
  } catch (error) {
    console.error('Error validating Discord bot:', error)
    return null
  }
}
