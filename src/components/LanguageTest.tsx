/**
 * Language Test Component
 * Simple component to test if language switching works
 */

import { useTranslation } from 'react-i18next';

export function LanguageTest() {
  const { t, i18n } = useTranslation();

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-semibold mb-2">Language Test</h3>
      <div className="space-y-1 text-sm">
        <p><strong>Current:</strong> {i18n.language}</p>
        <p><strong>Dashboard:</strong> {t('navigation.dashboard')}</p>
        <p><strong>Profile:</strong> {t('navigation.profile')}</p>
        <p><strong>Settings:</strong> {t('navigation.settings')}</p>
        <p><strong>Search:</strong> {t('common.search')}</p>
      </div>
    </div>
  );
}
