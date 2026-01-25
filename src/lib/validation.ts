/**
 * Input Validation Schemas using Zod
 * Centralized validation for all API endpoints
 */

import { z } from 'zod'

// ========== CAR SCHEMAS ==========

export const carCreateSchema = z.object({
  model: z.string()
    .min(2, 'Model must be at least 2 characters')
    .max(200, 'Model must be less than 200 characters')
    .trim(),
  year: z.number()
    .int('Year must be an integer')
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  condition: z.enum(['excellent', 'good', 'fair', 'needs_work']),
  price: z.number()
    .min(0, 'Price must be positive')
    .optional()
    .nullable(),
  description: z.string()
    .max(5000, 'Description must be less than 5000 characters')
    .trim()
    .optional()
    .nullable(),
  images: z.string()
    .min(2, 'Images data is required')
    .refine((val) => {
      try {
        const parsed = JSON.parse(val)
        return Array.isArray(parsed) && parsed.length > 0
      } catch {
        return false
      }
    }, 'Images must be a valid JSON array with at least one image'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
})

export const carUpdateSchema = carCreateSchema.partial()

export const carSearchSchema = z.object({
  q: z.string().max(200).optional(),
  minYear: z.coerce.number().int().min(1900).optional(),
  maxYear: z.coerce.number().int().max(new Date().getFullYear() + 1).optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'needs_work']).optional(),
  isActive: z.enum(['true', 'false', 'all']).optional(),
  isFeatured: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['createdAt', 'year', 'model']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
})

// ========== SPARE PART SCHEMAS ==========

export const sparePartCreateSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be less than 200 characters')
    .trim(),
  description: z.string()
    .max(5000, 'Description must be less than 5000 characters')
    .trim()
    .optional()
    .nullable(),
  price: z.number()
    .min(0, 'Price must be positive'),
  images: z.string()
    .min(2, 'Images data is required')
    .refine((val) => {
      try {
        const parsed = JSON.parse(val)
        return Array.isArray(parsed) && parsed.length > 0
      } catch {
        return false
      }
    }, 'Images must be a valid JSON array with at least one image'),
  isActive: z.boolean().default(true)
})

export const sparePartUpdateSchema = sparePartCreateSchema.partial()

export const sparePartSearchSchema = z.object({
  q: z.string().max(200).optional(),
  isActive: z.enum(['true', 'false', 'all']).optional(),
  sortBy: z.enum(['createdAt', 'name', 'price']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
})

// ========== AUTH SCHEMAS ==========

export const loginSchema = z.object({
  email: z.string()
    .min(3, 'Email must be at least 3 characters')
    .max(200, 'Email must be less than 200 characters')
    .trim(),
  password: z.string()
    .min(4, 'Password must be at least 4 characters')
    .max(200, 'Password must be less than 200 characters')
})

export const adminCreateSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(200, 'Email must be less than 200 characters')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(200, 'Password must be less than 200 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim()
})

export const adminUpdateSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(200, 'Password must be less than 200 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .optional(),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
})

// ========== INQUIRY SCHEMAS ==========

export const inquiryCreateSchema = z.object({
  carId: z.string().cuid().optional().nullable(),
  partId: z.string().cuid().optional().nullable(),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email format')
    .max(200, 'Email must be less than 200 characters')
    .trim()
    .toLowerCase()
    .optional()
    .nullable(),
  phone: z.string()
    .min(8, 'Phone must be at least 8 characters')
    .max(20, 'Phone must be less than 20 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .trim(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .trim()
}).refine(data => data.carId || data.partId, {
  message: 'Either carId or partId must be provided'
})

// ========== SETTINGS SCHEMAS ==========

export const settingsUpdateSchema = z.object({
  logoUrl: z.string()
    .url('Invalid URL format')
    .max(500, 'URL must be less than 500 characters')
    .optional()
    .nullable()
})

// ========== ANALYTICS SCHEMAS ==========

export const analyticsTrackSchema = z.object({
  page: z.string()
    .max(500, 'Page path too long')
    .trim(),
  entityType: z.enum(['car', 'part', 'page']).optional().nullable(),
  entityId: z.string().cuid().optional().nullable(),
  eventType: z.enum(['view', 'click', 'inquiry', 'wishlist']).optional().nullable(),
  metadata: z.any().optional().nullable()
})

// ========== FILE UPLOAD SCHEMAS ==========

export const fileUploadMetadataSchema = z.object({
  filename: z.string()
    .min(1, 'Filename is required')
    .max(255, 'Filename too long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid filename characters'),
  size: z.number()
    .int()
    .min(1, 'File size must be greater than 0')
    .max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  type: z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
})

// ========== HELPER FUNCTIONS ==========

/**
 * Validate data with a schema and return formatted errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  result.error.issues.forEach(issue => {
    const path = issue.path.join('.')
    errors[path || 'general'] = issue.message
  })

  return { success: false, errors }
}

/**
 * Sanitize string input (trim, remove dangerous chars)
 */
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframes
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj)
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key])
      }
    }
    return sanitized
  }
  return obj
}

// Export type inference helpers
export type CarCreate = z.infer<typeof carCreateSchema>
export type CarUpdate = z.infer<typeof carUpdateSchema>
export type SparePartCreate = z.infer<typeof sparePartCreateSchema>
export type SparePartUpdate = z.infer<typeof sparePartUpdateSchema>
export type Login = z.infer<typeof loginSchema>
export type AdminCreate = z.infer<typeof adminCreateSchema>
export type InquiryCreate = z.infer<typeof inquiryCreateSchema>
