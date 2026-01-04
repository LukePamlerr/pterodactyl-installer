import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bot = await prisma.bot.findUnique({
      where: {
        applicationId: params.id,
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
          orderBy: {
            createdAt: 'desc',
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
    })

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    const formattedBot = {
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
    }

    return NextResponse.json(formattedBot)
  } catch (error) {
    console.error('Error fetching bot details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bot details' },
      { status: 500 }
    )
  }
}
