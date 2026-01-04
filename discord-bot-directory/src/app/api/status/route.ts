import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    
    // Get system metrics
    const [totalBots, approvedBots, totalUsers, totalReviews] = await Promise.all([
      prisma.bot.count(),
      prisma.bot.count({ where: { approved: true } }),
      prisma.user.count(),
      prisma.review.count(),
    ])

    // Simulate service status checks
    const services = [
      {
        name: 'Website',
        status: 'operational',
        description: 'Main website and user interface',
        lastChecked: now.toISOString(),
        uptime: 99.9,
        responseTime: 245,
      },
      {
        name: 'API',
        status: 'operational',
        description: 'REST API endpoints',
        lastChecked: now.toISOString(),
        uptime: 99.8,
        responseTime: 156,
      },
      {
        name: 'Database',
        status: 'operational',
        description: 'PostgreSQL database',
        lastChecked: now.toISOString(),
        uptime: 99.95,
        responseTime: 12,
      },
      {
        name: 'Authentication',
        status: 'operational',
        description: 'Discord OAuth integration',
        lastChecked: now.toISOString(),
        uptime: 99.7,
        responseTime: 423,
      },
      {
        name: 'Discord API',
        status: 'operational',
        description: 'External Discord API connectivity',
        lastChecked: now.toISOString(),
        uptime: 99.5,
        responseTime: 189,
      },
    ]

    const metrics = {
      totalBots: approvedBots,
      activeUsers: totalUsers,
      apiCalls: Math.floor(Math.random() * 100000) + 50000, // Simulated
      databaseConnections: 15,
      serverLoad: Math.floor(Math.random() * 30) + 10, // Simulated
      memoryUsage: Math.floor(Math.random() * 40) + 30, // Simulated
    }

    return NextResponse.json({
      services,
      metrics,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status data' },
      { status: 500 }
    )
  }
}
