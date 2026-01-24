'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      await uploadFile(file)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      await uploadFile(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('نوع الملف غير مدعوم | Invalid file type\nفقط: JPG, PNG, WebP, GIF | Only: JPG, PNG, WebP, GIF')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الملف كبير جداً | File size too large\nالحد الأقصى: 5MB | Max size: 5MB')
      return
    }

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
        onImagesChange([...images, data.url])
      } else {
        alert(data.error || 'فشل رفع الصورة | Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('فشل رفع الصورة | Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <Label>الصور | Images</Label>

      {/* Upload Zone */}
      {images.length < maxImages && (
        <Card
          className={`border-2 border-dashed transition-all ${
            dragActive
              ? 'border-gold-500 bg-gold-500/5'
              : 'border-gold-500/30 hover:border-gold-500/50 bg-card/30'
          }`}
        >
          <CardContent className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-4 cursor-pointer"
              onClick={handleButtonClick}
            >
              {uploading ? (
                <>
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
                  <p className="text-center text-sm text-muted-foreground">
                    جاري الرفع... | Uploading...
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gold-500" />
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-gold-500">
                      اسحب وأفلت الصور هنا<br />
                      <span className="text-sm font-normal">Drag & drop images here</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      أو انقر للاختيار<br />
                      <span className="text-xs">or click to select</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP, GIF (Max 5MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="w-full aspect-video rounded-lg border border-gold-500/20 overflow-hidden bg-black/20">
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Add more images button */}
          {images.length < maxImages && (
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              className="flex h-full min-h-[150px] flex-col items-center justify-center gap-2 border-2 border-dashed border-gold-500/30 hover:border-gold-500"
            >
              <Upload className="h-8 w-8 text-gold-500" />
              <span className="text-sm text-gold-500">
                إضافة صورة أخرى<br />
                <span className="text-xs">Add another image</span>
              </span>
            </Button>
          )}
        </div>
      )}

      {/* Image count */}
      <p className="text-xs text-muted-foreground">
        {images.length} / {maxImages} صور | {images.length} / {maxImages} images
      </p>
    </div>
  )
}

import { Label } from '@/components/ui/label'
