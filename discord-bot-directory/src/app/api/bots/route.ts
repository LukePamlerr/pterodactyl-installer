import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDiscordNotification } from '@/lib/webhook'
import { validateBotSubmission } from '@/lib/validation'
import { ValidationError, DatabaseError, createErrorResponse } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const bots = await prisma.bot.findMany({
      where: {
        approved: true,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        submitter: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        votes: 'desc',
      },
    })

    const formattedBots = bots.map(bot => ({
      id: bot.id,
      applicationId: bot.applicationId,
      name: bot.name,
      description: bot.description,
      avatar: bot.avatar,
      tags: bot.tags,
      votes: bot.votes,
      serverCount: bot.serverCount,
      status: bot.status,
      approved: bot.approved,
      featured: bot.featured,
      inviteUrl: bot.inviteUrl,
      createdAt: bot.createdAt.toISOString(),
      reviews: bot.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
        user: review.user,
      })),
      submitter: bot.submitter,
    }))

    return NextResponse.json(formattedBots)
  } catch (error) {
    console.error('Error fetching bots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bots' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, name, description, tags, website, support, github, submittedBy } = body

    // Validate input
    const validation = validateBotSubmission({
      applicationId,
      name,
      description,
      tags: tags || [],
      website,
      support,
      github,
    })

    if (!validation.isValid) {
      throw new ValidationError('Validation failed', validation.errors)
    }

    if (!submittedBy) {
      throw new ValidationError('User ID is required')
    }

    // Check if bot already exists
    const existingBot = await prisma.bot.findUnique({
      where: { applicationId },
    })

    if (existingBot) {
      throw new ValidationError('Bot with this Application ID already exists')
    }

    const bot = await prisma.bot.create({
      data: {
        applicationId,
        name,
        description,
        tags: tags || [],
        website,
        support,
        github,
        submittedBy,
        inviteUrl: `https://discord.com/oauth2/authorize?client_id=${applicationId}&permissions=8&scope=bot%20applications.commands`,
      },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Send Discord notification
    await sendDiscordNotification({
      type: 'bot_submitted',
      bot,
      user: bot.submitter,
    })

    return NextResponse.json(bot, { status: 201 })
  } catch (error) {
    console.error('Error creating bot:', error)
    return createErrorResponse(error)
  }
}
