'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WishlistContextType {
  wishlist: string[]
  addToWishlist: (carId: string) => void
  removeFromWishlist: (carId: string) => void
  isInWishlist: (carId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load wishlist from localStorage
    const stored = localStorage.getItem('vintage-point-wishlist')
    if (stored) {
      try {
        setWishlist(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading wishlist:', error)
      }
    }
  }, [])

  const addToWishlist = (carId: string) => {
    setWishlist(prev => {
      if (prev.includes(carId)) return prev
      const updated = [...prev, carId]
      if (mounted) {
        localStorage.setItem('vintage-point-wishlist', JSON.stringify(updated))
      }
      return updated
    })
  }

  const removeFromWishlist = (carId: string) => {
    setWishlist(prev => {
      const updated = prev.filter(id => id !== carId)
      if (mounted) {
        localStorage.setItem('vintage-point-wishlist', JSON.stringify(updated))
      }
      return updated
    })
  }

  const isInWishlist = (carId: string) => wishlist.includes(carId)

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
