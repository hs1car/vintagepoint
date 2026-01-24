import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink, appendFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { createHash } from 'crypto'
import sharp from 'sharp'

// Allowed file types and their magic numbers
const FILE_SIGNATURES = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/jpg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
}

// Dangerous file extensions to block
const DANGEROUS_EXTENSIONS = [
  '.php', '.php5', '.php7', '.phtml', '.pht',
  '.asp', '.aspx', '.jsp', '.js', '.exe',
  '.bat', '.cmd', '.sh', '.dll', '.so'
]

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Max image dimensions
const MAX_IMAGE_WIDTH = 10000
const MAX_IMAGE_HEIGHT = 10000

// Min image dimensions
const MIN_IMAGE_WIDTH = 10
const MIN_IMAGE_HEIGHT = 10

// Rate limiting - store uploads by IP
const uploadTracker = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 20 // Max uploads per minute
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIP || 'unknown'
  return ip.trim()
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const tracker = uploadTracker.get(ip)

  if (!tracker || now > tracker.resetTime) {
    uploadTracker.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }

  if (tracker.count >= RATE_LIMIT_MAX) {
    return false
  }

  tracker.count++
  return true
}

function sanitizeFilename(filename: string): string {
  // Remove any dangerous characters
  const sanitized = filename
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/\.{2,}/g, '.')
    .toLowerCase()

  // Check for dangerous extensions
  const ext = path.extname(sanitized)
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    throw new Error('Dangerous file extension detected')
  }

  return sanitized
}

async function validateFileSignature(buffer: Buffer, declaredType: string): Promise<boolean> {
  const signature = FILE_SIGNATURES[declaredType as keyof typeof FILE_SIGNATURES]

  if (!signature) {
    return false
  }

  // Check if the file signature matches the declared type
  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) {
      return false
    }
  }

  return true
}

async function validateImageDimensions(buffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata()

    if (!metadata.width || !metadata.height) {
      return false
    }

    if (
      metadata.width > MAX_IMAGE_WIDTH ||
      metadata.height > MAX_IMAGE_HEIGHT ||
      metadata.width < MIN_IMAGE_WIDTH ||
      metadata.height < MIN_IMAGE_HEIGHT
    ) {
      return false
    }

    return true
  } catch (error) {
    console.error('Error validating image dimensions:', error)
    return false
  }
}

async function isDoublyFile(buffer: Buffer): Promise<boolean> {
  // Check for common doubly file signatures
  const header = buffer.slice(0, 20).toString('hex').toLowerCase()
  const doublyPatterns = [
    '4d5a9000', // EXE (MZ header)
    '504b0304', // ZIP (PK header) - could contain scripts
    '7b5c72',   // JAR/CLASS
    'cafebabe', // CLASS
  ]

  return doublyPatterns.some(pattern => header.startsWith(pattern))
}

async function logUpload(filename: string, size: number, type: string, ip: string, success: boolean) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    filename,
    size,
    type,
    ip,
    success
  }

  try {
    const logsDir = path.join(process.cwd(), 'logs')
    if (!existsSync(logsDir)) {
      await mkdir(logsDir, { recursive: true })
    }

    const logFile = path.join(logsDir, 'uploads.log')
    const logLine = JSON.stringify(logEntry) + '\n'

    await appendFile(logFile, logLine, 'utf-8')
  } catch (error) {
    console.error('Error logging upload:', error)
  }
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)

  // Rate limiting
  if (!checkRateLimit(clientIP)) {
    await logUpload('', 0, '', clientIP, false)
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      await logUpload('', 0, '', clientIP, false)
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      await logUpload(file.name, file.size, file.type, clientIP, false)
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      await logUpload(file.name, file.size, file.type, clientIP, false)
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Get file buffer for validation
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file signature (magic numbers)
    const signatureValid = await validateFileSignature(buffer, file.type)
    if (!signatureValid) {
      await logUpload(file.name, file.size, file.type, clientIP, false)
      return NextResponse.json(
        { error: 'File type mismatch or corrupted file.' },
        { status: 400 }
      )
    }

    // Check for doubly files
    const isDoubly = await isDoublyFile(buffer)
    if (isDoubly) {
      await logUpload(file.name, file.size, file.type, clientIP, false)
      return NextResponse.json(
        { error: 'Invalid file content detected.' },
        { status: 400 }
      )
    }

    // Validate image dimensions
    const dimensionsValid = await validateImageDimensions(buffer)
    if (!dimensionsValid) {
      await logUpload(file.name, file.size, file.type, clientIP, false)
      return NextResponse.json(
        { error: 'Image dimensions must be between 10x10 and 10000x10000 pixels.' },
        { status: 400 }
      )
    }

    // Sanitize filename
    const fileExtension = path.extname(file.name)
    const baseName = path.basename(file.name, fileExtension)
    const sanitizedName = sanitizeFilename(baseName)
    const fileName = `${randomUUID()}${fileExtension}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    await writeFile(filePath, buffer)

    // Log successful upload
    await logUpload(fileName, file.size, file.type, clientIP, true)

    // Return URL
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    const clientIP = getClientIP(request)
    await logUpload('', 0, '', clientIP, false)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
