'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, Image as ImageIcon, X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SiteSettings() {
  const router = useRouter()
  const [logoUrl, setLogoUrl] = useState('')
  const [defaultLogo, setDefaultLogo] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setLogoUrl(data.logoUrl || '')
        setDefaultLogo(data.logoUrl || '')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type (PNG is best for transparent logos)
    const allowedTypes = ['image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('نوع الملف غير مدعوم | Invalid file type\nيفضل PNG أو WebP | Prefer PNG or WebP')
      return
    }

    // Validate file size (2MB max for logos)
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الملف كبير جداً | File size too large\nالحد الأقصى: 2MB | Max size: 2MB')
      return
    }

    // Create instant preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setLogoUrl(data.url)
        setPreviewUrl('') // Clear preview as we have the uploaded URL
        setUploading(false)
      } else {
        alert(data.error || 'فشل رفع الشعار | Upload failed')
        setPreviewUrl('')
        setUploading(false)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('فشل رفع الشعار | Upload failed')
      setPreviewUrl('')
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl })
      })

      if (res.ok) {
        alert('تم حفظ الشعار بنجاح | Logo saved successfully!')
        router.push('/admin/dashboard')
      } else {
        alert('فشل حفظ الشعار | Failed to save logo')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('فشل حفظ الشعار | Failed to save logo')
    } finally {
      setLoading(false)
    }
  }

  const handleResetToDefault = () => {
    if (confirm('هل أنت متأكد من إعادة الشعار للوضع الافتراضي؟\nAre you sure you want to reset the logo to default?')) {
      setLogoUrl(defaultLogo)
    }
  }

  const handleUsePlaceholder = () => {
    if (confirm('هل تريد استخدام شعار نصي بدون صورة؟\nDo you want to use a text logo without image?')) {
      setLogoUrl('')
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
              onClick={() => router.push('/admin/dashboard')}
              className="text-gold-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              رجوع | Back
            </Button>
            <h1 className="text-xl font-bold text-gold-400">
              <span className="block">إعدادات الموقع</span>
              <span className="text-sm text-muted-foreground">Site Settings</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gold-400">
                شعار الموقع | Site Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  معاينة الشعار | Logo Preview
                </label>
                <div className="flex items-center justify-center gap-8 rounded-xl bg-background p-8 border-2 border-dashed border-gold-500/20 min-h-[280px]">
                  {(logoUrl || previewUrl) ? (
                    <div className="max-h-64 flex items-center justify-center">
                      <img
                        src={previewUrl || logoUrl}
                        alt="Site Logo Preview"
                        className="max-h-64 w-auto object-contain max-w-full"
                        loading="eager"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold-600 to-gold-400 text-black font-bold text-3xl">
                        VP
                      </div>
                      <p className="text-center text-sm text-muted-foreground">
                        <span className="block">شعار افتراضي</span>
                        <span className="block text-xs">Default Logo</span>
                      </p>
                    </div>
                  )}
                </div>
                {(logoUrl || previewUrl) && (
                  <div className="flex gap-2">
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewUrl('')}
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                      >
                        <X className="mr-1 h-4 w-4" />
                        إلغاء المعاينة | Cancel Preview
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLogoUrl('')
                        setPreviewUrl('')
                      }}
                      className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                    >
                      <X className="mr-1 h-4 w-4" />
                      إزالة الشعار | Remove Logo
                    </Button>
                  </div>
                )}
              </div>

              {/* Logo URL Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  رابط الشعار (اختياري) | Logo URL (Optional)
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/uploads/your-logo.png"
                  className="w-full rounded-md border border-gold-500/30 bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
                />
                <p className="text-xs text-muted-foreground">
                  أدخل رابط الشعار أو ارفع صورة جديدة | Enter logo URL or upload new image
                </p>
              </div>

              {/* Upload Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  رفع شعار جديد | Upload New Logo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.querySelector('input[type="file"]') as HTMLInputElement
                      input?.click()
                    }}
                    disabled={uploading}
                    className="w-full border-2 border-dashed border-gold-500/30 py-8"
                  >
                    {uploading ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                        <span>جاري الرفع... | Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5 text-gold-500" />
                        <span>اسحب وأفلت الصورة هنا</span>
                        <span className="block text-xs text-muted-foreground">Drag & drop logo image here</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, WebP, SVG (Max 2MB) - يفضل استخدام PNG مع خلفية شفافة | Prefer PNG with transparent background
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-3 md:grid-cols-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetToDefault}
                  className="border-gold-500/50 text-gold-500 hover:bg-gold-500/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span className="text-sm">الافتراضي | Default</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUsePlaceholder}
                  className="border-gold-500/50 text-gold-500 hover:bg-gold-500/10"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm">بدون صورة | No Image</span>
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gold-500 hover:bg-gold-600 text-black"
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      <span>جاري الحفظ... | Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <span>حفظ التغييرات | Save Changes</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Tips */}
              <div className="rounded-lg bg-gold-500/5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gold-400">
                  نصائح مهمة | Important Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500">•</span>
                    <span>
                      استخدم صورة PNG بخلفية شفافة لمظهر احترافي | Use PNG image with transparent background for professional look
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500">•</span>
                    <span>
                      الحجم الأمثل للشعار: 200x200 بكسل | Optimal logo size: 200x200 pixels
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500">•</span>
                    <span>
                      الشعار الشفاف يعمل بشكل أفضل مع أي خلفية | Transparent logo works best with any background
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
