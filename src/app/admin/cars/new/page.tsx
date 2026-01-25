'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ImageUpload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CarFormData {
  model: string
  year: string
  condition: string
  price: string
  description: string
  images: string[]
}

export default function CarForm() {
  const router = useRouter()
  const [isNew, setIsNew] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CarFormData>({
    model: '',
    year: '',
    condition: '',
    price: '',
    description: '',
    images: []
  })

  useEffect(() => {
    const path = window.location.pathname
    if (path.includes('/admin/cars/') && path !== '/admin/cars/new') {
      setIsNew(false)
      // Load car data for editing
      const carId = path.split('/').pop()
      if (carId && carId !== 'new') {
        loadCarData(carId)
      }
    }
  }, [])

  const loadCarData = async (carId: string) => {
    try {
      const res = await fetch(`/api/cars/${carId}`)
      if (res.ok) {
        const car = await res.json()
        setFormData({
          model: car.model || '',
          year: car.year?.toString() || '',
          condition: car.condition || '',
          price: car.price?.toString() || '',
          description: car.description || '',
          images: car.images ? JSON.parse(car.images) : []
        })
      }
    } catch (error) {
      console.error('Error loading car:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const path = window.location.pathname
      const carId = path.split('/').pop()

      const url = isNew ? '/api/cars' : `/api/cars/${carId}`
      const method = isNew ? 'POST' : 'PUT'

      console.log('Submitting car data:', { url, method, formData })

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year),
          price: parseFloat(formData.price)
        })
      })

      const data = await res.json()
      console.log('API Response:', { status: res.status, data })

      if (res.ok) {
        alert(isNew ? 'تم إضافة السيارة بنجاح! ✓\nCar added successfully!' : 'تم تحديث السيارة بنجاح! ✓\nCar updated successfully!')
        router.push('/admin/cars')
        router.refresh()
      } else {
        throw new Error(data.error || 'Failed to save car')
      }
    } catch (error) {
      console.error('Error saving car:', error)
      alert(`حدث خطأ! ✗\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nتأكد من:\n- تسجيل الدخول\n- ملء جميع الحقول المطلوبة\n- رفع صورة واحدة على الأقل`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black/30">
      {/* Header */}
      <header className="border-b border-gold-500/20 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/cars')}
              className="text-gold-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              رجوع | Back
            </Button>
            <h1 className="text-xl font-bold text-gold-400">
              {isNew ? (
                <>
                  <span className="block">إضافة سيارة جديدة</span>
                  <span className="text-sm text-muted-foreground">Add New Car</span>
                </>
              ) : (
                <>
                  <span className="block">تعديل السيارة</span>
                  <span className="text-sm text-muted-foreground">Edit Car</span>
                </>
              )}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gold-400">
                {isNew ? 'تفاصيل السيارة الجديدة | New Car Details' : 'تفاصيل السيارة | Car Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="model">
                      موديل السيارة | Car Model <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="model"
                      placeholder="مرسيدس بنز 280SE | Mercedes-Benz 280SE"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                      className="border-gold-500/30 focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">
                      سنة الصنع | Year <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="1971"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                      min="1900"
                      max="2025"
                      className="border-gold-500/30 focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="condition">
                      حالة السيارة | Condition <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger className="border-gold-500/30">
                        <SelectValue placeholder="اختر الحالة | Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ممتازة | Excellent">ممتازة | Excellent</SelectItem>
                        <SelectItem value="جيدة جداً | Very Good">جيدة جداً | Very Good</SelectItem>
                        <SelectItem value="جيدة | Good">جيدة | Good</SelectItem>
                        <SelectItem value="متوسطة | Fair">متوسطة | Fair</SelectItem>
                        <SelectItem value="تحتاج عمل | Needs Work">تحتاج عمل | Needs Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      السعر (AED) | Price <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="185000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                      className="border-gold-500/30 focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف | Description</Label>
                  <Textarea
                    id="description"
                    placeholder="وصف السيارة... | Car description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="border-gold-500/30 focus:border-gold-500 resize-none"
                  />
                </div>

                {/* Images */}
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData({ ...formData, images })}
                  maxImages={10}
                />

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-gold-500/10">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gold-500 hover:bg-gold-600 text-black"
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        جاري الحفظ | Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        حفظ | Save
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/cars')}
                    className="border-gold-500/50 text-gold-500 hover:bg-gold-500/10"
                  >
                    إلغاء | Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
