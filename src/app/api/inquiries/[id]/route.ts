import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { devLog } from '@/lib/logger'
import { withProtection } from '@/lib/api-protection'

export const DELETE = withProtection(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  await db.inquiry.delete({
    where: { id }
  })

  return NextResponse.json({ success: true })
}, {
  requireAuth: true,
})
