import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { devLog } from '@/lib/logger'

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      devLog.info('[getSessionUser] No session token found')
      return null
    }

    devLog.info('[getSessionUser] Session found')

    // sessionToken is the admin user ID
    const admin = await db.adminUser.findUnique({
      where: {
        id: sessionToken
      }
    })

    if (!admin) {
      devLog.warn('[getSessionUser] No admin found')
      return null
    }

    devLog.info('[getSessionUser] Admin authenticated')

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: UserRole.ADMIN,
    }
  } catch (error) {
    devLog.error('[getSessionUser] Error getting session:', error)
    return null
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getSessionUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getSessionUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (user.role !== UserRole.ADMIN) {
    throw new Error('Forbidden: Admin access required')
  }

  return user
}

export function createAuthHeaders() {
  return {
    'Content-Type': 'application/json',
  }
}

export function createUnauthorizedResponse(message = 'Unauthorized') {
  return Response.json(
    { error: message },
    { status: 401 }
  )
}

export function createForbiddenResponse(message = 'Forbidden') {
  return Response.json(
    { error: message },
    { status: 403 }
  )
}
