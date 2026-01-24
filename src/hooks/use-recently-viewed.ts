'use client'

import { useEffect, useState } from 'react'

interface ViewedItem {
  id: string
  type: 'car' | 'part'
  title: string
  image: string
  timestamp: number
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<ViewedItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed')
    if (stored) {
      setItems(JSON.parse(stored))
    }
  }, [])

  const addItem = (item: Omit<ViewedItem, 'timestamp'>) => {
    const newItems = [
      { ...item, timestamp: Date.now() },
      ...items.filter(i => !(i.id === item.id && i.type === item.type))
    ].slice(0, 6) // Keep only 6 items

    setItems(newItems)
    localStorage.setItem('recentlyViewed', JSON.stringify(newItems))
  }

  return { items, addItem }
}
