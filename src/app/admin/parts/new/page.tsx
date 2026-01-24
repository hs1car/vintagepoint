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

interface PartFormData {
  name: string
  description: string
  price: string
  images: string[]
}

export default function PartForm() {
  const router = useRouter()
  const [isNew, setIsNew] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PartFormData>({
    name: '',
    description: '',
    price: '',
    images: []
  })

  useEffect(() => {
    const path = window.location.pathname
    if (path.includes('/admin/parts/') && path !== '/admin/parts/new') {
      setIsNew(false)
      const partId = path.split('/').pop()
      if (partId && partId !== 'new') {
        loadPartData(partId)
      }
    }
  }, [])

  const loadPartData = async (partId: string) => {
    try {
      const res = await fetch(`/api/parts/${partId}`)
      if (res.ok) {
        const part = await res.json()
        setFormData({
          name: part.name || '',
          description: part.description || '',
          price: part.price?.toString() || '',
          images: part.images ? JSON.parse(part.images) : []
        })
      }
    } catch (error) {
      console.error('Error loading part:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const path = window.location.pathname
      const partId = path.split('/').pop()

      const url = isNew ? '/api/parts' : `/api/parts/${partId}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })

      if (res.ok) {
        router.push('/admin/parts')
      }
    } catch (error) {
      console.error('Error saving part:', error)
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
              onClick={() => router.push('/admin/parts')}
              className="text-gold-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              رجوع | Back
            </Button>
            <h1 className="text-xl font-bold text-gold-400">
              {isNew ? (
                <>
                  <span className="block">إضافة قطعة غيار جديدة</span>
                  <span className="text-sm text-muted-foreground">Add New Part</span>
                </>
              ) : (
                <>
                  <span className="block">تعديل القطعة</span>
                  <span className="text-sm text-muted-foreground">Edit Part</span>
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
                {isNew ? 'تفاصيل القطعة الجديدة | New Part Details' : 'تفاصيل القطعة | Part Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    اسم القطعة | Part Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="محرك مرسيدس متوافق | Mercedes Compatible Engine"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-gold-500/30 focus:border-gold-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف | Description</Label>
                  <Textarea
                    id="description"
                    placeholder="وصف القطعة... | Part description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="border-gold-500/30 focus:border-gold-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    السعر (AED) | Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="45000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="border-gold-500/30 focus:border-gold-500"
                  />
                </div>

                {/* Images */}
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData({ ...formData, images })}
                  maxImages={5}
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
                    onClick={() => router.push('/admin/parts')}
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
