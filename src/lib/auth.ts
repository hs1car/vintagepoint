import { cookies } from 'next/headers'
import { db } from '@/lib/db'

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
      return null
    }

    const session = await db.adminUser.findFirst({
      where: {
        email: sessionToken
      }
    })

    if (!session) {
      return null
    }

    return {
      id: session.id,
      email: session.email,
      name: session.name,
      role: UserRole.ADMIN,
    }
  } catch (error) {
    console.error('Error getting session:', error)
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
