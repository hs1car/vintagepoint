'use client'

import { useEffect } from 'react'

interface TrackPageViewProps {
  page: string
  entityType?: string
  entityId?: string
}

export default function TrackPageView({ page, entityType, entityId }: TrackPageViewProps) {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, entityType, entityId })
    }).catch(() => {})
  }, [page, entityType, entityId])

  return null
}
