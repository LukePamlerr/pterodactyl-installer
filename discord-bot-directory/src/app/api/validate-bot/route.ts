import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { validateDiscordBot } from '@/lib/discord'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { applicationId } = await request.json()

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    const botData = await validateDiscordBot(applicationId, session.user.id)

    if (!botData) {
      return NextResponse.json(
        { error: 'Invalid Discord Application ID or insufficient permissions' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      id: botData.id,
      applicationId: botData.applicationId,
      name: botData.name,
      description: botData.description,
      icon: botData.icon,
      owner: botData.owner,
      bot_public: botData.bot_public,
      bot_require_code_grant: botData.bot_require_code_grant,
    })
  } catch (error) {
    console.error('Error validating bot:', error)
    return NextResponse.json(
      { error: 'Failed to validate bot' },
      { status: 500 }
    )
  }
}
