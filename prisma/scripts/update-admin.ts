import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating admin credentials...')

  // New admin credentials
  const email = 'vp@admin.com'
  const password = 'root'
  const name = 'Vintage Point Admin'

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Check if admin exists
  const existingAdmin = await prisma.adminUser.findFirst()

  if (existingAdmin) {
    // Update existing admin
    await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })
    console.log('✅ Admin credentials updated successfully!')
  } else {
    // Create new admin
    await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })
    console.log('✅ New admin user created successfully!')
  }

  console.log('\n📋 Admin Login Details:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Email/Username: vp')
  console.log('Password: root')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Error updating admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
