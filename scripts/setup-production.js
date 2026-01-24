const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up production database...')

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst()
    
    if (existingAdmin) {
      console.log('✅ Admin already exists, skipping creation')
      return
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('vp2024admin', 10)
    
    await prisma.admin.create({
      data: {
        username: 'vp',
        password: hashedPassword,
        role: 'root',
      },
    })

    console.log('✅ Default admin created successfully!')
    console.log('📋 Username: vp')
    console.log('📋 Password: vp2024admin')
    console.log('⚠️  Please change the password after first login!')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    // Don't exit with error - allow build to continue
  } finally {
    await prisma.$disconnect()
  }
}

main()
