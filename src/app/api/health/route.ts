/**
 * Health Check Endpoint
 * Monitors system health and dependencies
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    database: {
      status: 'up' | 'down'
      latency?: number
      error?: string
    }
    memory: {
      used: number
      total: number
      percentage: number
    }
    environment: {
      nodeEnv: string
      nodeVersion: string
    }
  }
}

export async function GET() {
  const startTime = Date.now()
  const status: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: { status: 'down' },
      memory: {
        used: 0,
        total: 0,
        percentage: 0,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        nodeVersion: process.version,
      },
    },
  }

  // Check Database Connection
  try {
    const dbStart = Date.now()
    await db.$queryRaw`SELECT 1`
    const dbLatency = Date.now() - dbStart
    
    status.checks.database = {
      status: 'up',
      latency: dbLatency,
    }
  } catch (error) {
    status.status = 'unhealthy'
    status.checks.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  // Check Memory Usage
  const memUsage = process.memoryUsage()
  status.checks.memory = {
    used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
    total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
    percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
  }

  // Determine overall status
  if (status.checks.database.status === 'down') {
    status.status = 'unhealthy'
  } else if (status.checks.memory.percentage > 90) {
    status.status = 'degraded'
  }

  const httpStatus = status.status === 'healthy' ? 200 : status.status === 'degraded' ? 503 : 503

  return NextResponse.json(status, { 
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
