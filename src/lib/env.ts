/**
 * Environment Variables Validation
 * Ensures all required env vars are present at build time
 */

import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // App URLs
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  
  // Contact Information (Public)
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),
  NEXT_PUBLIC_PHONE_NUMBER: z.string().optional(),
  NEXT_PUBLIC_EMAIL: z.string().email().optional(),
  
  // Security (Private)
  SESSION_SECRET: z.string().min(32).optional(),
  CSRF_SECRET: z.string().min(32).optional(),
  
  // Upload Limits
  MAX_FILE_SIZE: z.string().optional(),
  MAX_IMAGE_WIDTH: z.string().optional(),
  MAX_IMAGE_HEIGHT: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validate environment variables
 * Call this at application startup
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env)
    
    // Additional validation for production
    if (env.NODE_ENV === 'production') {
      if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
        throw new Error('SESSION_SECRET must be at least 32 characters in production')
      }
      if (!env.CSRF_SECRET || env.CSRF_SECRET.length < 32) {
        throw new Error('CSRF_SECRET must be at least 32 characters in production')
      }
      if (!env.DATABASE_URL.startsWith('postgresql://')) {
        console.warn('⚠️  WARNING: Using non-PostgreSQL database in production')
      }
    }
    
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:')
      error.issues.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      process.exit(1)
    }
    throw error
  }
}

/**
 * Get validated environment variables
 */
export const env = validateEnv()

/**
 * Type-safe environment variable access
 */
export function getEnv<K extends keyof Env>(key: K): Env[K] {
  return env[key]
}
