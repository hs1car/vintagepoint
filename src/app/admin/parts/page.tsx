'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Power, PowerOff, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { PartSearchBar, type PartSearchFilters } from '@/components/admin/PartSearchBar'
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

interface SparePart {
  id: string
  name: string
  description: string
  price: number
  images: string
  isActive: boolean
}

export default function AdminParts() {
  const { t } = useLanguage()
  const router = useRouter()
  const [parts, setParts] = useState<SparePart[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentFilters, setCurrentFilters] = useState<PartSearchFilters>({})
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; partId: string | null }>({
    open: false,
    partId: null
  })

  useEffect(() => {
    fetchParts(currentFilters, currentPage)
  }, [])

  const fetchParts = async (filters: PartSearchFilters = {}, page: number = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.query) params.append('q', filters.query)
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
      params.append('page', page.toString())
      params.append('limit', '20')

      const res = await fetch(`/api/parts/search?${params}`)
      if (res.ok) {
        const data = await res.json()
        setParts(data.parts)
        setTotalCount(data.pagination.totalCount)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (filters: PartSearchFilters) => {
    setCurrentFilters(filters)
    fetchParts(filters, 1)
  }

  const handleToggleActive = async (partId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/parts/${partId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (res.ok) {
        fetchParts(currentFilters, currentPage)
      }
    } catch (error) {
      console.error('Error toggling part status:', error)
    }
  }

  const handleDelete = async (partId: string) => {
    try {
      const res = await fetch(`/api/parts/${partId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setDeleteDialog({ open: false, partId: null })
        fetchParts(currentFilters, currentPage)
      }
    } catch (error) {
      console.error('Error deleting part:', error)
    }
  }

  const parseImages = (images: string): string[] => {
    if (!images) return []
    try {
      return JSON.parse(images)
    } catch {
      return images.split(',').map(img => img.trim()).filter(Boolean)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black/30">
      {/* Header */}
      <header className="border-b border-gold-500/20 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gold-400">
              <span className="block">إدارة قطع الغيار ({totalCount})</span>
              <span className="text-sm text-muted-foreground">Manage Spare Parts ({totalCount})</span>
            </h1>
            <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="ghost"
              className="text-gold-500"
            >
              العودة للرئيسية | Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <PartSearchBar
            onSearch={handleSearch}
            initialFilters={currentFilters}
            showActiveFilter={true}
          />
        </motion.div>

        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-end"
        >
          <Button
            onClick={() => router.push('/admin/parts/new')}
            className="bg-gold-500 hover:bg-gold-600 text-black"
          >
            <Plus className="mr-2 h-4 w-4" />
            إضافة قطعة | Add Part
          </Button>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-gold-500/20">
                <div className="aspect-square animate-pulse bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 animate-pulse bg-muted rounded" />
                  <div className="h-3 animate-pulse bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : parts.length === 0 ? (
          <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wrench className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground">
                لا توجد نتائج مطابقة | No matching results found
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {parts.map((part, index) => {
              const partImages = parseImages(part.images)
              return (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-gold-500/20 bg-card/50 backdrop-blur overflow-hidden ${!part.isActive ? 'opacity-60' : ''}`}>
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-black/10 to-black/5">
                      {partImages.length > 0 ? (
                        <img
                          src={partImages[0]}
                          alt={part.name}
                          className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Wrench className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold text-gold-400 line-clamp-2">
                        {part.name}
                      </h3>
                      {part.description && (
                        <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                          {part.description}
                        </p>
                      )}
                      <p className="mb-3 text-lg font-bold">
                        AED {part.price.toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/parts/${part.id}`)}
                          className="flex-1 border-gold-500/50 text-gold-500 hover:bg-gold-500/10"
                        >
                          <Edit2 className="mr-1 h-4 w-4" />
                          تعديل | Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(part.id, part.isActive)}
                          className={part.isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-red-500 hover:bg-red-500/10'}
                        >
                          {part.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, partId: part.id })}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent className="border-gold-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف | Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذه القطعة؟<br />
              Are you sure you want to delete this part?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gold-500/50">إلغاء | Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.partId && handleDelete(deleteDialog.partId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف | Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
