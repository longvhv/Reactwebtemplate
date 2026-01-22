/**
 * Language Provider with react-i18next
 * Modern i18n setup using react-i18next library
 */

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTranslation as useI18nTranslation, I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { LanguageCode, LANGUAGE_STORAGE_KEY } from '../constants/languages';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  changeLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
  i18n: typeof i18n;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

function LanguageProviderInner({ children }: LanguageProviderProps) {
  const { t, i18n: i18nInstance } = useI18nTranslation();
  
  useEffect(() => {
    // Set HTML lang attribute
    document.documentElement.lang = i18nInstance.language;
  }, [i18nInstance.language]);

  const setLanguage = async (lang: LanguageCode) => {
    console.log('🌍 Changing language to:', lang);
    try {
      await i18nInstance.changeLanguage(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
      console.log('✅ Language changed successfully to:', lang);
    } catch (error) {
      console.error('❌ Error changing language:', error);
    }
  };

  const translate = (key: string, params?: Record<string, string | number>): string => {
    return t(key, params);
  };

  const value: LanguageContextType = {
    currentLanguage: i18nInstance.language as LanguageCode,
    changeLanguage: setLanguage,
    t: translate,
    language: i18nInstance.language as LanguageCode,
    setLanguage,
    translate,
    i18n: i18nInstance,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProviderInner>{children}</LanguageProviderInner>
    </I18nextProvider>
  );
}

/**
 * useLanguage Hook
 * Access language context with type safety
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
 * Direct access to react-i18next translation function
 * This is the recommended hook for components
 */
export function useTranslation() {
  const { t, i18n } = useI18nTranslation();
  
  return { 
    t, 
    translate: t,
    i18n,
    language: i18n.language as LanguageCode,
    changeLanguage: (lang: LanguageCode) => i18n.changeLanguage(lang),
  };
}
