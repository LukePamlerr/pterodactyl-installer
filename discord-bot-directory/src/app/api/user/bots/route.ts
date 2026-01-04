import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bots = await prisma.bot.findMany({
      where: {
        submittedBy: session.user.id,
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
        createdAt: 'desc',
      },
    })

    const formattedBots = bots.map((bot: any) => ({
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
      website: bot.website,
      support: bot.support,
      github: bot.github,
      prefix: bot.prefix,
      createdAt: bot.createdAt.toISOString(),
      reviews: bot.reviews.map((review: any) => ({
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
    console.error('Error fetching user bots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user bots' },
      { status: 500 }
    )
  }
}
