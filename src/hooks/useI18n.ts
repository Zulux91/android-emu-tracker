import { useState, useEffect, useCallback } from 'react'
import { en } from '../i18n/en'
import { es } from '../i18n/es'
import type { TranslationKeys } from '../i18n/en'

const TRANSLATIONS: Record<string, TranslationKeys> = { en, es }
const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur'])

function detectLang(): string {
  const full = navigator.language || (navigator.languages?.[0]) || 'en'
  return full.split('-')[0].toLowerCase()
}

export function useI18n() {
  const [lang, setLangState] = useState<string>(() => {
    const stored = localStorage.getItem('lang')
    return stored ?? detectLang()
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr'
  }, [lang])

  const setLang = useCallback((l: string) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }, [])

  const translations = TRANSLATIONS[lang] ?? en

  const t = useCallback(
    (section: keyof TranslationKeys, key: string): string => {
      const sec = translations[section] as Record<string, string> | undefined
      return sec?.[key] ?? (en[section] as Record<string, string>)[key] ?? key
    },
    [translations]
  )

  return { lang, setLang, t, availableLangs: Object.keys(TRANSLATIONS) }
}
