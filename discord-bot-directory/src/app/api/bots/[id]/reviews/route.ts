import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendDiscordNotification } from '@/lib/webhook'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { rating, comment } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const bot = await prisma.bot.findUnique({
      where: { applicationId: params.id },
    })

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        botId_userId: {
          botId: bot.id,
          userId: session.user.id,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this bot' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        botId: bot.id,
        userId: session.user.id,
        rating,
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    await prisma.bot.update({
      where: { id: bot.id },
      data: {
        votes: bot.votes + 1,
      },
    })

    // Send Discord notification
    await sendDiscordNotification({
      type: 'bot_reviewed',
      bot,
      user: review.user,
      review: {
        rating,
        comment,
      },
    })

    return NextResponse.json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      user: review.user,
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
