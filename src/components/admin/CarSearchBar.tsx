'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export interface CarSearchFilters {
  q: string
  minYear?: number
  maxYear?: number
  condition?: string
  isActive?: boolean
  sortBy: string
  sortOrder: string
}

interface CarSearchBarProps {
  onSearch: (filters: CarSearchFilters) => void
  initialFilters?: Partial<CarSearchFilters>
  showActiveFilter?: boolean
}

export function CarSearchBar({ onSearch, initialFilters, showActiveFilter = false }: CarSearchBarProps) {
  const [filters, setFilters] = useState<CarSearchFilters>({
    q: initialFilters?.q || '',
    minYear: initialFilters?.minYear,
    maxYear: initialFilters?.maxYear,
    condition: initialFilters?.condition || 'all',
    isActive: initialFilters?.isActive,
    sortBy: initialFilters?.sortBy || 'createdAt',
    sortOrder: initialFilters?.sortOrder || 'desc'
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters: CarSearchFilters = {
      q: '',
      condition: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  const activeFiltersCount = [
    filters.minYear,
    filters.maxYear,
    filters.condition !== 'all' ? filters.condition : null,
    filters.isActive !== undefined ? filters.isActive : null
  ].filter(Boolean).length

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن سيارات أو قطع غيار..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-card/50 border-gold-500/20 focus:border-gold-500/50"
          />
        </div>
        
        <Button onClick={handleSearch} className="bg-gold-600 hover:bg-gold-700">
          <Search className="h-4 w-4 mr-2" />
          بحث
        </Button>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-gold-500/20 hover:border-gold-500/50 relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              فلترة
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gold-600">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-background/95 backdrop-blur border-gold-500/20">
            <SheetHeader>
              <SheetTitle className="text-gold-400">خيارات الفلترة</SheetTitle>
              <SheetDescription>تصفية النتائج حسب تفضيلاتك</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Year Range */}
              <div className="space-y-2">
                <Label className="text-gold-400">سنة الصنع</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={filters.minYear?.toString() || ''}
                    onValueChange={(value) => setFilters({ ...filters, minYear: value ? parseInt(value) : undefined })}
                  >
                    <SelectTrigger className="bg-card/50 border-gold-500/20">
                      <SelectValue placeholder="من" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">الكل</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.maxYear?.toString() || ''}
                    onValueChange={(value) => setFilters({ ...filters, maxYear: value ? parseInt(value) : undefined })}
                  >
                    <SelectTrigger className="bg-card/50 border-gold-500/20">
                      <SelectValue placeholder="إلى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">الكل</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label className="text-gold-400">الحالة</Label>
                <Select
                  value={filters.condition}
                  onValueChange={(value) => setFilters({ ...filters, condition: value })}
                >
                  <SelectTrigger className="bg-card/50 border-gold-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="new">جديدة</SelectItem>
                    <SelectItem value="used">مستعملة</SelectItem>
                    <SelectItem value="classic">كلاسيكية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Status (Admin only) */}
              {showActiveFilter && (
                <div className="space-y-2">
                  <Label className="text-gold-400">الحالة النشطة</Label>
                  <Select
                    value={filters.isActive === undefined ? 'all' : filters.isActive.toString()}
                    onValueChange={(value) => setFilters({ 
                      ...filters, 
                      isActive: value === 'all' ? undefined : value === 'true' 
                    })}
                  >
                    <SelectTrigger className="bg-card/50 border-gold-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="true">نشط</SelectItem>
                      <SelectItem value="false">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sort By */}
              <div className="space-y-2">
                <Label className="text-gold-400">ترتيب حسب</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                  >
                    <SelectTrigger className="bg-card/50 border-gold-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">تاريخ الإضافة</SelectItem>
                      <SelectItem value="price">السعر</SelectItem>
                      <SelectItem value="year">السنة</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
                  >
                    <SelectTrigger className="bg-card/50 border-gold-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">تنازلي</SelectItem>
                      <SelectItem value="asc">تصاعدي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    handleSearch()
                    setIsFilterOpen(false)
                  }}
                  className="flex-1 bg-gold-600 hover:bg-gold-700"
                >
                  تطبيق الفلترة
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-gold-500/20 hover:border-gold-500/50"
                >
                  <X className="h-4 w-4 mr-2" />
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.minYear && (
            <Badge variant="outline" className="border-gold-500/30 text-gold-400">
              من سنة: {filters.minYear}
              <button
                onClick={() => setFilters({ ...filters, minYear: undefined })}
                className="ml-1 hover:text-gold-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.maxYear && (
            <Badge variant="outline" className="border-gold-500/30 text-gold-400">
              إلى سنة: {filters.maxYear}
              <button
                onClick={() => setFilters({ ...filters, maxYear: undefined })}
                className="ml-1 hover:text-gold-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.condition !== 'all' && (
            <Badge variant="outline" className="border-gold-500/30 text-gold-400">
              الحالة: {filters.condition === 'new' ? 'جديدة' : filters.condition === 'used' ? 'مستعملة' : 'كلاسيكية'}
              <button
                onClick={() => setFilters({ ...filters, condition: 'all' })}
                className="ml-1 hover:text-gold-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
