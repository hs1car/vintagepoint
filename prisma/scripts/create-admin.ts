import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Creating admin user...')

  const email = 'admin@vintagepoint.ae'
  const password = 'admin123'
  const name = 'Admin User'

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('⚠️ Admin user already exists!')
    console.log(`Email: ${email}`)
    console.log('Password: admin123 (or your existing password)')
    await prisma.$disconnect()
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  })

  console.log('✅ Admin user created successfully!')
  console.log(`\n📧 Email: ${email}`)
  console.log(`🔑 Password: ${password}`)
  console.log(`\n🔗 Login URL: http://localhost:3000/admin/login`)
  console.log('\n⚠️ Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
