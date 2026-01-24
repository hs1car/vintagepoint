'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminPage() {
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    // Check if user is authenticated
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/verify')
        if (res.ok) {
          router.push('/admin/dashboard')
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4" />
        <p className="text-muted-foreground">جاري التحميل... | Loading...</p>
      </div>
    </div>
  )
}
