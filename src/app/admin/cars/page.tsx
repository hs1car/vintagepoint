'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Power, PowerOff, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useLanguage } from '@/contexts/LanguageContext'

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

interface FilterOptions {
  search: string
  minPrice: string
  maxPrice: string
  minYear: string
  maxYear: string
  condition: string
  status: 'all' | 'active' | 'inactive'
  sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high'
}

export default function AdminCars() {
  const { t } = useLanguage()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; carId: string | null }>({
    open: false,
    carId: null
  })

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    condition: 'all',
    status: 'all',
    sortBy: 'newest'
  })

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars')
      if (res.ok) {
        const data = await res.json()
        setCars(data)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (carId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (res.ok) {
        fetchCars()
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
        fetchCars()
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

  const filterAndSortCars = (cars: Car[]): Car[] => {
    let filtered = [...cars]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(car =>
        car.model.toLowerCase().includes(searchLower) ||
        car.year.toString().includes(searchLower) ||
        car.description?.toLowerCase().includes(searchLower)
      )
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(car => car.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.price <= Number(filters.maxPrice))
    }

    // Year range filter
    if (filters.minYear) {
      filtered = filtered.filter(car => car.year >= Number(filters.minYear))
    }
    if (filters.maxYear) {
      filtered = filtered.filter(car => car.year <= Number(filters.maxYear))
    }

    // Condition filter
    if (filters.condition !== 'all') {
      filtered = filtered.filter(car => car.condition === filters.condition)
    }

    // Status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(car => car.isActive)
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(car => !car.isActive)
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'oldest':
        filtered.sort((a, b) => a.id.localeCompare(b.id))
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
    }

    return filtered
  }

  const filteredCars = filterAndSortCars(cars)

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      condition: 'all',
      status: 'all',
      sortBy: 'newest'
    })
  }

  const hasActiveFilters = filters.search || filters.minPrice || filters.maxPrice || filters.minYear || filters.maxYear || filters.condition !== 'all' || filters.status !== 'all'

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black/30">
      {/* Header */}
      <header className="border-b border-gold-500/20 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gold-400">
              <span className="block">إدارة السيارات</span>
              <span className="text-sm text-muted-foreground">Manage Cars</span>
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
        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 space-y-4"
        >
          {/* Search and Add */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث | Search..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pr-10 border-gold-500/30 focus:border-gold-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? 'default' : 'outline'}
                className={showFilters ? 'bg-gold-500 text-black' : 'border-gold-500/50 text-gold-500'}
              >
                <Filter className="mr-2 h-4 w-4" />
                فلاتر | Filters
              </Button>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  مسح الفلاتر | Clear
                </Button>
              )}
              <Button
                onClick={() => router.push('/admin/cars/new')}
                className="bg-gold-500 hover:bg-gold-600 text-black"
              >
                <Plus className="mr-2 h-4 w-4" />
                إضافة سيارة | Add Car
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg border border-gold-500/20 bg-card/50 p-4"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">السعر | Price</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="border-gold-500/30"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="border-gold-500/30"
                    />
                  </div>
                </div>

                {/* Year Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">السنة | Year</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minYear}
                      onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                      className="border-gold-500/30"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxYear}
                      onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
                      className="border-gold-500/30"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">الحالة | Condition</label>
                  <Select
                    value={filters.condition}
                    onValueChange={(value) => setFilters({ ...filters, condition: value })}
                  >
                    <SelectTrigger className="border-gold-500/30">
                      <SelectValue placeholder="الكل | All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل | All</SelectItem>
                      <SelectItem value="Excellent">ممتاز | Excellent</SelectItem>
                      <SelectItem value="Very Good">جيد جداً | Very Good</SelectItem>
                      <SelectItem value="Good">جيد | Good</SelectItem>
                      <SelectItem value="Fair">مقبول | Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status & Sort */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">الحالة & الترتيب | Status & Sort</label>
                  <div className="flex gap-2">
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters({ ...filters, status: value as any })}
                    >
                      <SelectTrigger className="border-gold-500/30">
                        <SelectValue placeholder="الكل | All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الكل | All</SelectItem>
                        <SelectItem value="active">نشط | Active</SelectItem>
                        <SelectItem value="inactive">غير نشط | Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => setFilters({ ...filters, sortBy: value as any })}
                    >
                      <SelectTrigger className="border-gold-500/30">
                        <SelectValue placeholder="ترتيب | Sort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">الأحدث | Newest</SelectItem>
                        <SelectItem value="oldest">الأقدم | Oldest</SelectItem>
                        <SelectItem value="price-low">الأقل سعراً | Price Low</SelectItem>
                        <SelectItem value="price-high">الأعلى سعراً | Price High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-gold-500/10">
                <p className="text-sm text-muted-foreground">
                  {filteredCars.length} سيارة | {filteredCars.length} Cars {filteredCars.length !== cars.length && `(من ${cars.length} total)`}
                </p>
              </div>
            </motion.div>
          )}
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
        ) : filteredCars.length === 0 ? (
          <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground text-center">
                {hasActiveFilters ? 'لا توجد نتائج مطابقة للفلاتر | No matching results found' : 'لا توجد سيارات | No cars available'}
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-4 border-gold-500/50 text-gold-500"
                >
                  مسح الفلاتر | Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car, index) => {
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
