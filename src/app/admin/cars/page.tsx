'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Power, PowerOff, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useLanguage } from '@/contexts/LanguageContext'
import { CarSearchBar, type CarSearchFilters } from '@/components/admin/CarSearchBar'

interface Car {
  id: string
  model: string
  year: number
  condition: string
  price: number
  description: string
  images: string
  isActive: boolean
}

export default function AdminCars() {
  const { t } = useLanguage()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; carId: string | null }>({
    open: false,
    carId: null
  })

  const [currentFilters, setCurrentFilters] = useState<CarSearchFilters>({
    q: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  useEffect(() => {
    fetchCars(currentFilters, currentPage)
  }, [])

  const fetchCars = async (filters: CarSearchFilters, page: number = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.q) params.set('q', filters.q)
      if (filters.minYear) params.set('minYear', filters.minYear.toString())
      if (filters.maxYear) params.set('maxYear', filters.maxYear.toString())
      if (filters.condition && filters.condition !== 'all') params.set('condition', filters.condition)
      if (filters.isActive !== undefined) params.set('isActive', filters.isActive.toString())
      params.set('sortBy', filters.sortBy)
      params.set('sortOrder', filters.sortOrder)
      params.set('page', page.toString())
      params.set('limit', '20')

      const res = await fetch(`/api/cars/search?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setCars(data.cars)
        setTotalCount(data.pagination.totalCount)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (filters: CarSearchFilters) => {
    setCurrentFilters(filters)
    fetchCars(filters, 1)
  }

  const handleToggleActive = async (carId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (res.ok) {
        fetchCars(currentFilters, currentPage)
      }
    } catch (error) {
      console.error('Error toggling car status:', error)
    }
  }

  const handleDelete = async (carId: string) => {
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setDeleteDialog({ open: false, carId: null })
        fetchCars(currentFilters, currentPage)
      }
    } catch (error) {
      console.error('Error deleting car:', error)
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
            <div>
              <h1 className="text-2xl font-bold text-gold-400">
                <span className="block">إدارة السيارات</span>
                <span className="text-sm text-muted-foreground">Manage Cars</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                إجمالي السيارات: {totalCount}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/admin/cars/new')}
                className="bg-gold-500 hover:bg-gold-600 text-black font-bold shadow-lg shadow-gold-500/50"
              >
                <Plus className="mr-2 h-5 w-5" />
                إضافة سيارة
              </Button>
              <Button
                onClick={() => router.push('/admin/dashboard')}
                variant="ghost"
                className="text-gold-500"
              >
                العودة للرئيسية
              </Button>
            </div>
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
          <CarSearchBar
            onSearch={handleSearch}
            initialFilters={currentFilters}
            showActiveFilter={true}
          />
        </motion.div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-gold-500/20">
                <div className="aspect-video animate-pulse bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 animate-pulse bg-muted rounded" />
                  <div className="h-3 animate-pulse bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground text-center">
                لا توجد نتائج مطابقة | No matching results found
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, index) => {
              const carImages = parseImages(car.images)
              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-gold-500/20 bg-card/50 backdrop-blur overflow-hidden ${!car.isActive ? 'opacity-60' : ''}`}>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {carImages.length > 0 ? (
                          carImages.map((img, i) => (
                            <CarouselItem key={i}>
                              <div className="aspect-video overflow-hidden bg-black/20">
                                <img
                                  src={img}
                                  alt={`${car.model} - ${i + 1}`}
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                            </CarouselItem>
                          ))
                        ) : (
                          <CarouselItem>
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <Search className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                          </CarouselItem>
                        )}
                      </CarouselContent>
                      {carImages.length > 1 && (
                        <>
                          <CarouselPrevious className="left-2" />
                          <CarouselNext className="right-2" />
                        </>
                      )}
                    </Carousel>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold text-gold-400 line-clamp-1">
                        {car.model}
                      </h3>
                      <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">{t('common.year')}:</span>
                          <span className="mr-2">{car.year}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('common.condition')}:</span>
                          <span className="mr-2">{car.condition}</span>
                        </div>
                      </div>
                      <p className="mb-3 text-lg font-bold text-gold-500">
                        AED {car.price.toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/cars/${car.id}`)}
                          className="flex-1 border-gold-500/50 text-gold-500 hover:bg-gold-500/10"
                        >
                          <Edit2 className="mr-1 h-4 w-4" />
                          تعديل | Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(car.id, car.isActive)}
                          className={car.isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-red-500 hover:bg-red-500/10'}
                        >
                          {car.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, carId: car.id })}
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
              هل أنت متأكد من حذف هذه السيارة؟<br />
              Are you sure you want to delete this car?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gold-500/50">إلغاء | Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.carId && handleDelete(deleteDialog.carId)}
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
