/**
 * i18n Index
 * Export all translations
 */

import { vi } from './vi';
import { en } from './en';
import { es } from './es';
import { zh } from './zh';
import { ja } from './ja';
import { ko } from './ko';
import type { LanguageCode } from '../constants/languages';
import type { TranslationKeys } from './vi';

export const translations: Record<LanguageCode, TranslationKeys> = {
  vi,
  en,
  es,
  zh,
  ja,
  ko,
};

export type { TranslationKeys };
