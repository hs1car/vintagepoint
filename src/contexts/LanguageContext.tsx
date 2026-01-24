'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'ar' | 'en' | 'ru' | 'hi' | 'ur'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar')
  const [translations, setTranslations] = useState<any>(null)

  useEffect(() => {
    async function loadTranslations() {
      try {
        const module = await import(`../locales/${language}.json`)
        setTranslations(module.default)
      } catch (error) {
        console.error('Failed to load translations:', error)
      }
    }
    loadTranslations()
  }, [language])

  const t = (key: string): string => {
    if (!translations) return key
    const keys = key.split('.')
    let value = translations
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return key
    }
    return value
  }

  const isRTL = language === 'ar' || language === 'ur'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Helper function to parse bilingual text (Arabic | English)
export function parseBilingualText(text: string, showBoth: boolean = true): { ar: string; en: string } {
  if (!text) return { ar: '', en: '' }

  const parts = text.split('|').map((part) => part.trim())

  if (parts.length === 1) {
    return { ar: parts[0], en: parts[0] }
  }

  return {
    ar: parts[0],
    en: parts[1] || parts[0],
  }
}

// Helper to display bilingual text (Arabic first, then English below)
export function BilingualText({ text, showBoth = true }: { text: string; showBoth?: boolean }) {
  const { language } = useLanguage()
  const { ar, en } = parseBilingualText(text, showBoth)

  if (language === 'en' && !showBoth) {
    return <>{en}</>
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-base">{ar}</span>
      <span className="text-sm text-muted-foreground">{en}</span>
    </div>
  )
}
