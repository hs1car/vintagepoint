'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { motion } from 'framer-motion'
import { ZoomIn, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const slides = images.map((image) => ({ src: image }))

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group cursor-pointer overflow-hidden rounded-md border border-gold-500/20 hover:border-gold-500/50 transition-all"
            onClick={() => openLightbox(index)}
          >
            <div className="aspect-square relative">
              <img
                src={image}
                alt={`${alt} - صورة ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1">
                <ZoomIn className="h-5 w-5 text-white" />
              </div>
              {/* Image number badge */}
              <div className="absolute top-1 right-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-[10px]">
                {index + 1}/{images.length}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox with Swipe Support */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        animation={{ fade: 300, swipe: 250 }}
        carousel={{ 
          finite: false,
          preload: 2,
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
          closeOnPullUp: true,
        }}
        render={{
          buttonPrev: () => (
            <button className="yarl__button yarl__navigation_prev">
              <ChevronRight className="h-8 w-8" />
            </button>
          ),
          buttonNext: () => (
            <button className="yarl__button yarl__navigation_next">
              <ChevronLeft className="h-8 w-8" />
            </button>
          ),
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      />
    </>
  )
}
