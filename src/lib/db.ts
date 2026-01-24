import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only instantiate PrismaClient if DATABASE_URL is available
// This prevents build-time errors when the database is not accessible
export const db: PrismaClient = process.env.DATABASE_URL
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log: ['query'],
    }))
  : (new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL is not set - database operations are not available')
      }
    }))

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = db
}