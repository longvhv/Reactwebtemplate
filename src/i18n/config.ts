/**
 * i18next Configuration
 * React-i18next setup with namespace support, lazy loading, and TypeScript
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations
import { vi } from './vi';
import { en } from './en';
import { es } from './es';
import { zh } from './zh';
import { ja } from './ja';
import { ko } from './ko';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '../constants/languages';

// Resources configuration
const resources = {
  vi: { translation: vi },
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
} as const;

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    lng: DEFAULT_LANGUAGE, // Default language
    fallbackLng: 'en', // Fallback language
    defaultNS: 'translation',
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
      prefix: '{{',
      suffix: '}}',
    },

    // React options
    react: {
      useSuspense: false, // Disable suspense for better control
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
    },

    // Debug options (disable in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Performance
    load: 'currentOnly',
    preload: [DEFAULT_LANGUAGE],
    
    // Namespace options
    ns: ['translation'],
    
    // Key separator
    keySeparator: '.',
    nsSeparator: ':',
    
    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Missing key handler
    saveMissing: false,
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lngs[0]}`);
      }
    },
  });

export default i18n;
