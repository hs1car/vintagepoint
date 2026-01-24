'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Phone,
  Mail,
  Car,
  Wrench,
  Calendar,
  User,
  ArrowLeft,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  message: string
  entityType: string
  entityId: string
  createdAt: string
  car?: {
    model: string
    year: number
  }
  sparePart?: {
    name: string
  }
}

export default function InquiriesPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries')
      if (res.ok) {
        const data = await res.json()
        setInquiries(data)
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setInquiries(inquiries.filter(i => i.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete inquiry:', error)
    }
    setDeleteId(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const openWhatsApp = (phone: string, name: string) => {
    const message = language === 'ar' 
      ? `مرحباً ${name}، شكراً لاستفسارك`
      : `Hello ${name}, thank you for your inquiry`
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black/30">
      {/* Header */}
      <header className="border-b border-gold-500/20 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/dashboard')}
                className="text-gold-500 hover:text-gold-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gold-400">
                  الاستفسارات | Inquiries
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? `${inquiries.length} استفسار`
                    : `${inquiries.length} inquiries`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {inquiries.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {language === 'ar' ? 'لا توجد استفسارات بعد' : 'No inquiries yet'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'سيتم عرض الاستفسارات هنا عندما يتصل بك العملاء'
                : 'Inquiries will appear here when customers contact you'}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {inquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-gold-500/20 hover:border-gold-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Main Info */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gold-500/10 p-3 rounded-full">
                              {inquiry.entityType === 'car' ? (
                                <Car className="h-6 w-6 text-gold-500" />
                              ) : (
                                <Wrench className="h-6 w-6 text-green-500" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">
                                {inquiry.car 
                                  ? `${inquiry.car.model} ${inquiry.car.year}`
                                  : inquiry.sparePart?.name || 'General Inquiry'}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(inquiry.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(inquiry.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'الاسم' : 'Name'}
                              </p>
                              <p className="font-semibold">{inquiry.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'البريد' : 'Email'}
                              </p>
                              <a 
                                href={`mailto:${inquiry.email}`}
                                className="font-semibold hover:text-gold-500"
                              >
                                {inquiry.email}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'الهاتف' : 'Phone'}
                              </p>
                              <a 
                                href={`tel:${inquiry.phone}`}
                                className="font-semibold hover:text-gold-500"
                              >
                                {inquiry.phone}
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-2">
                            {language === 'ar' ? 'الرسالة' : 'Message'}
                          </p>
                          <p className="text-sm leading-relaxed">{inquiry.message}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Button
                          onClick={() => openWhatsApp(inquiry.phone, inquiry.name)}
                          className="bg-green-600 hover:bg-green-700 text-white gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          <span className="hidden md:inline">
                            {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                          </span>
                        </Button>
                        {inquiry.entityId && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              const path = inquiry.entityType === 'car' 
                                ? `/admin/cars/${inquiry.entityId}`
                                : `/admin/parts/${inquiry.entityId}`
                              router.push(path)
                            }}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden md:inline">
                              {language === 'ar' ? 'عرض' : 'View'}
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar'
                ? 'هل أنت متأكد من حذف هذا الاستفسار؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this inquiry? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
