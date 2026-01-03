/**
 * Language Provider
 * Provides i18n context to the application
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKeys } from '../i18n';
import { 
  LanguageCode, 
  DEFAULT_LANGUAGE, 
  LANGUAGE_STORAGE_KEY 
} from '../constants/languages';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationKeys;
  translate: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Get nested property from object using dot notation
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Replace placeholders in translation string
 */
function replacePlaceholders(
  text: string,
  params?: Record<string, string | number>
): string {
  if (!params) return text;

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }, text);
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // Get saved language from localStorage
    if (typeof localStorage === 'undefined') return DEFAULT_LANGUAGE;
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode;
    return saved || DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang: LanguageCode) => {
    console.log('🌍 Setting language to:', lang);
    setLanguageState(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    console.log('✅ Language updated to:', lang);
  };

  useEffect(() => {
    // Set initial HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  /**
   * Translate function with dot notation support
   * Usage: translate('common.hello') or translate('validation.required', { field: 'Email' })
   */
  const translate = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedProperty(translations[language], key);
    
    if (translation === undefined) {
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
      return key;
    }

    return replacePlaceholders(String(translation), params);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * useLanguage Hook
 * Access language context
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  
  return context;
}

/**
 * useTranslation Hook
 * Simplified translation hook
 */
export function useTranslation() {
  const { t, translate } = useLanguage();
  
  return { t, translate };
}