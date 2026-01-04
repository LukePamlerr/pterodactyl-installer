import { NextRequest, NextResponse } from 'next/server'

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

export async function sendDiscordNotification(data: {
  type: 'bot_submitted' | 'bot_approved' | 'bot_reviewed'
  bot?: any
  user?: any
  review?: any
}) {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured')
    return
  }

  let embed: any = {}

  switch (data.type) {
    case 'bot_submitted':
      embed = {
        title: '🤖 New Bot Submission',
        description: `A new Discord bot has been submitted for review`,
        color: 0x0099ff,
        fields: [
          {
            name: 'Bot Name',
            value: data.bot?.name || 'Unknown',
            inline: true,
          },
          {
            name: 'Application ID',
            value: data.bot?.applicationId || 'Unknown',
            inline: true,
          },
          {
            name: 'Submitted By',
            value: data.user?.name || 'Unknown User',
            inline: true,
          },
          {
            name: 'Description',
            value: data.bot?.description || 'No description provided',
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Discord Bot Directory',
        },
      }
      break

    case 'bot_approved':
      embed = {
        title: '✅ Bot Approved',
        description: `A Discord bot has been approved and is now live`,
        color: 0x00ff00,
        fields: [
          {
            name: 'Bot Name',
            value: data.bot?.name || 'Unknown',
            inline: true,
          },
          {
            name: 'Application ID',
            value: data.bot?.applicationId || 'Unknown',
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Discord Bot Directory',
        },
      }
      break

    case 'bot_reviewed':
      embed = {
        title: '⭐ New Review Posted',
        description: `A user has reviewed a Discord bot`,
        color: 0xffaa00,
        fields: [
          {
            name: 'Bot Name',
            value: data.bot?.name || 'Unknown',
            inline: true,
          },
          {
            name: 'Rating',
            value: `${'⭐'.repeat(data.review?.rating || 0)} (${data.review?.rating || 0}/5)`,
            inline: true,
          },
          {
            name: 'Reviewer',
            value: data.user?.name || 'Anonymous',
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Discord Bot Directory',
        },
      }
      if (data.review?.comment) {
        embed.fields.push({
          name: 'Comment',
          value: data.review.comment,
          inline: false,
        })
      }
      break
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      console.error('Failed to send Discord notification:', await response.text())
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error)
  }
}
