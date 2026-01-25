import path from 'path'
import { existsSync } from 'fs'
import { mkdir, appendFile } from 'fs/promises'

// Environment-aware logging
const isDevelopment = process.env.NODE_ENV === 'development'

// Safe console wrapper - only logs in development
export const devLog = {
  log: (...args: any[]) => isDevelopment && console.log(...args),
  error: (...args: any[]) => console.error(...args), // Always log errors
  warn: (...args: any[]) => isDevelopment && console.warn(...args),
  info: (...args: any[]) => isDevelopment && console.info(...args),
}

export enum LogType {
  UPLOAD = 'UPLOAD',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ERROR = 'ERROR',
  SETTINGS = 'SETTINGS',
}

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

interface LogEntry {
  timestamp: string
  type: LogType
  level: LogLevel
  action: string
  details?: any
  userId?: string
  ip?: string
  success?: boolean
}

class Logger {
  private logsDir: string

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs')
  }

  private async ensureLogsDir(): Promise<void> {
    if (!existsSync(this.logsDir)) {
      await mkdir(this.logsDir, { recursive: true })
    }
  }

  private getLogFilePath(type: LogType): string {
    const date = new Date().toISOString().split('T')[0]
    return path.join(this.logsDir, `${type.toLowerCase()}-${date}.log`)
  }

  async log(entry: LogEntry): Promise<void> {
    try {
      await this.ensureLogsDir()

      const logFilePath = this.getLogFilePath(entry.type)
      const logLine = JSON.stringify(entry) + '\n'

      await appendFile(logFilePath, logLine, 'utf-8')

      // Also write to combined log file
      const combinedLogPath = path.join(this.logsDir, 'combined.log')
      await appendFile(combinedLogPath, logLine, 'utf-8')

      // Only log to console in development
      devLog.log(`[${entry.type}] ${entry.action}`, entry.details || '')
    } catch (error) {
      devLog.error('Error writing to log file:', error)
    }
  }

  async upload(action: string, details: any, ip?: string, success = true): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      type: LogType.UPLOAD,
      level: success ? LogLevel.INFO : LogLevel.ERROR,
      action,
      details,
      ip,
      success,
    })
  }

  async delete(action: string, details: any, userId?: string, ip?: string): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      type: LogType.DELETE,
      level: LogLevel.INFO,
      action,
      details,
      userId,
      ip,
      success: true,
    })
  }

  async update(action: string, details: any, userId?: string, ip?: string): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      type: LogType.UPDATE,
      level: LogLevel.INFO,
      action,
      details,
      userId,
      ip,
      success: true,
    })
  }

  async login(email: string, userId: string, ip: string, success = true): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      type: LogType.LOGIN,
      level: success ? LogLevel.INFO : LogLevel.WARNING,
      action: 'User login attempt',
      details: { email },
      userId,
      ip,
      success,
    })
  }

  async logout(userId: string, ip: string): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      type: LogType.LOGOUT,
      level: LogLevel.INFO,
      action: 'User logout',
      details: {},
      userId,
      ip,
      success: true,
    })
  }

  async error(action: string, details: any, userId?: string, ip?: string): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      type: LogType.ERROR,
      level: LogLevel.ERROR,
      action,
      details,
      userId,
      ip,
      success: false,
    })
  }

  async settings(action: string, details: any, userId?: string, ip?: string): Promise<void> {
    await this.log({
      timestamp: new Date().toISOString(),
      type: LogType.SETTINGS,
      level: LogLevel.INFO,
      action,
      details,
      userId,
      ip,
      success: true,
    })
  }
}

export const logger = new Logger()
