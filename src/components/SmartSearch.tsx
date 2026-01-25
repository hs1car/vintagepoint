'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  type: 'car' | 'part'
  title: string
  subtitle: string
  image?: string
  price?: number
}

export function SmartSearch() {
  const { t, isRTL } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Smart search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const debounce = setTimeout(async () => {
      setLoading(true)
      try {
        const [carsRes, partsRes] = await Promise.all([
          fetch('/api/cars'),
          fetch('/api/parts')
        ])

        const cars = carsRes.ok ? await carsRes.json() : []
        const parts = partsRes.ok ? await partsRes.json() : []

        const searchLower = query.toLowerCase()

        // Search in cars
        const carResults: SearchResult[] = cars
          .filter((car: any) => 
            car.model.toLowerCase().includes(searchLower) ||
            car.year.toString().includes(searchLower) ||
            car.condition.toLowerCase().includes(searchLower)
          )
          .slice(0, 5)
          .map((car: any) => ({
            id: car.id,
            type: 'car' as const,
            title: `${car.model} ${car.year}`,
            subtitle: car.condition,
            image: car.images ? JSON.parse(car.images)[0] : undefined,
            price: car.price
          }))

        // Search in parts
        const partResults: SearchResult[] = parts
          .filter((part: any) =>
            part.name.toLowerCase().includes(searchLower) ||
            part.description?.toLowerCase().includes(searchLower)
          )
          .slice(0, 5)
          .map((part: any) => ({
            id: part.id,
            type: 'part' as const,
            title: part.name,
            subtitle: part.description || '',
            image: part.images ? JSON.parse(part.images)[0] : undefined,
            price: part.price
          }))

        setResults([...carResults, ...partResults])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    setQuery(searchQuery)
    setIsOpen(true)
  }

  const handleResultClick = (result: SearchResult) => {
    const path = result.type === 'car' ? `/cars/${result.id}` : `/parts/${result.id}`
    router.push(path)
    setIsOpen(false)
    setQuery('')
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
        <Input
          type="text"
          placeholder={isRTL ? 'ابحث عن سيارات أو قطع غيار...' : 'Search cars or parts...'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full h-12 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} bg-white/90 backdrop-blur-sm border-gold-200 focus:border-gold-500 focus:ring-gold-500`}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-2' : 'right-2'}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="max-h-96 overflow-y-auto shadow-xl border-gold-200">
              {/* Loading State */}
              {loading && (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold-600"></div>
                    {isRTL ? 'جاري البحث...' : 'Searching...'}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {!loading && results.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    {isRTL ? 'النتائج' : 'Results'}
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors text-start"
                    >
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {result.subtitle}
                        </div>
                      </div>
                      {result.price && (
                        <div className="text-sm font-semibold text-gold-600">
                          ${result.price.toLocaleString()}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && query && results.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{isRTL ? 'لا توجد نتائج' : 'No results found'}</p>
                  <p className="text-sm mt-1">
                    {isRTL ? 'جرب كلمات مختلفة' : 'Try different keywords'}
                  </p>
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {isRTL ? 'عمليات بحث سابقة' : 'Recent Searches'}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs h-auto py-1"
                    >
                      {isRTL ? 'مسح' : 'Clear'}
                    </Button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-accent transition-colors text-start"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
