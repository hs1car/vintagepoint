'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface WishlistButtonProps {
  carId: string
  variant?: 'default' | 'icon'
}

export function WishlistButton({ carId, variant = 'default' }: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(carId)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(carId)
    } else {
      addToWishlist(carId)
    }
  }

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={`p-2 rounded-full transition-all ${
          inWishlist
            ? 'bg-red-500/20 text-red-500'
            : 'bg-gold-500/10 text-gold-500 hover:bg-gold-500/20'
        }`}
      >
        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
      </motion.button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className={`gap-2 transition-all ${
        inWishlist
          ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20'
          : 'bg-gold-500/10 border-gold-500/50 text-gold-500 hover:bg-gold-500/20'
      }`}
    >
      <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
      <span>{inWishlist ? 'Saved' : 'Save'}</span>
    </Button>
  )
}
