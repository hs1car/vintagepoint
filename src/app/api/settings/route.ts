import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getOrCreateSettings() {
  try {
    const settings = await db.siteSettings.findFirst()
    if (!settings) {
      await db.siteSettings.create({ data: { logoUrl: '' } })
      return await db.siteSettings.findFirst()
    }
    return settings
  } catch (error) {
    console.error('Error in getOrCreateSettings:', error)
    throw error
  }
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings()
    return NextResponse.json({ logoUrl: settings?.logoUrl || '' })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ logoUrl: '' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { logoUrl } = body

    if (typeof logoUrl !== 'string') {
      return NextResponse.json(
        { error: 'Invalid logoUrl' },
        { status: 400 }
      )
    }

    const settings = await getOrCreateSettings()

    if (!settings) {
      return NextResponse.json(
        { error: 'Failed to get settings' },
        { status: 500 }
      )
    }

    await db.siteSettings.update({
      where: { id: settings.id },
      data: { logoUrl }
    })

    return NextResponse.json({ success: true, logoUrl })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
