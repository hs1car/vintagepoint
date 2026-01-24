import path from 'path'
import { existsSync, statSync, readFileSync } from 'fs'
import { mkdir, copyFile, readdir, writeFile } from 'fs/promises'
import { exec } from 'child_process'

export async function createBackup(): Promise<string> {
  const timestamp = new Date().toISOString().split('T')[0]
  const backupDir = path.join(process.cwd(), 'backups', `backup-${timestamp}`)

  try {
    // Create backup directory
    if (!existsSync(backupDir)) {
      await mkdir(backupDir, { recursive: true })
    }

    // Backup database
    const dbPath = path.join(process.cwd(), 'db', 'custom.db')
    if (existsSync(dbPath)) {
      await copyFile(dbPath, path.join(backupDir, 'database.db'))
      console.log('Database backed up successfully')
    }

    // Backup uploaded files
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const uploadsBackupDir = path.join(backupDir, 'uploads')

    if (existsSync(uploadsDir)) {
      await mkdir(uploadsBackupDir, { recursive: true })
      const files = await readdir(uploadsDir)

      for (const file of files) {
        await copyFile(
          path.join(uploadsDir, file),
          path.join(uploadsBackupDir, file)
        )
      }
      console.log('Uploads backed up successfully')
    }

    // Create backup info file
    const backupInfo = {
      timestamp,
      type: 'automatic',
      files: ['database.db', 'uploads/'],
      version: '1.0.0'
    }

    const infoPath = path.join(backupDir, 'backup-info.json')
    await writeFile(infoPath, JSON.stringify(backupInfo, null, 2), 'utf-8')

    console.log(`Backup created successfully: ${backupDir}`)

    // Clean old backups (keep last 7 days)
    await cleanOldBackups()

    return backupDir
  } catch (error) {
    console.error('Error creating backup:', error)
    throw error
  }
}

async function cleanOldBackups(daysToKeep = 7): Promise<void> {
  try {
    const backupsDir = path.join(process.cwd(), 'backups')

    if (!existsSync(backupsDir)) {
      return
    }

    const dirs = await readdir(backupsDir)
    const now = Date.now()
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000

    for (const dir of dirs) {
      const dirPath = path.join(backupsDir, dir)

      if (existsSync(dirPath)) {
        const stats = statSync(dirPath)
        const fileTime = new Date(stats.mtime || 0).getTime()
        const age = now - fileTime

        if (age > maxAge) {
          await exec(`rm -rf "${dirPath}"`)
          console.log(`Deleted old backup: ${dir}`)
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning old backups:', error)
  }
}

export async function restoreBackup(backupDate: string): Promise<void> {
  const backupDir = path.join(process.cwd(), 'backups', `backup-${backupDate}`)

  if (!existsSync(backupDir)) {
    throw new Error('Backup not found')
  }

  try {
    // Restore database
    const dbBackupPath = path.join(backupDir, 'database.db')
    if (existsSync(dbBackupPath)) {
      const dbPath = path.join(process.cwd(), 'db', 'custom.db')
      await copyFile(dbBackupPath, dbPath)
      console.log('Database restored successfully')
    }

    // Restore uploads
    const uploadsBackupDir = path.join(backupDir, 'uploads')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

    if (existsSync(uploadsBackupDir)) {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const files = await readdir(uploadsBackupDir)
      for (const file of files) {
        await copyFile(
          path.join(uploadsBackupDir, file),
          path.join(uploadsDir, file)
        )
      }
      console.log('Uploads restored successfully')
    }

    console.log(`Backup restored successfully from: ${backupDate}`)
  } catch (error) {
    console.error('Error restoring backup:', error)
    throw error
  }
}

export async function listBackups(): Promise<any[]> {
  const backupsDir = path.join(process.cwd(), 'backups')

  if (!existsSync(backupsDir)) {
    return []
  }

  try {
    const dirs = await readdir(backupsDir)
    const backups: any[] = []

    for (const dir of dirs) {
      const backupPath = path.join(backupsDir, dir)

      if (existsSync(backupPath)) {
        const infoPath = path.join(backupPath, 'backup-info.json')
        let info: any = {}

        try {
          const infoContent = readFileSync(infoPath, 'utf-8')
          info = JSON.parse(infoContent)
        } catch (error) {
          // If info file doesn't exist, use default values
          const stats = statSync(backupPath)
          info = {
            timestamp: stats.mtime,
            type: 'automatic'
          }
        }

        backups.push({
          date: dir.replace('backup-', ''),
          path: backupPath,
          ...info
        })
      }
    }

    return backups.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } catch (error) {
    console.error('Error listing backups:', error)
    return []
  }
}

// Schedule automatic backups (every 6 hours)
// Only run in server context
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  const SIX_HOURS = 6 * 60 * 60 * 1000

  setInterval(() => {
    createBackup().catch(error => {
      console.error('Scheduled backup failed:', error)
    })
  }, SIX_HOURS)

  console.log('Automatic backup scheduled (every 6 hours)')
}
