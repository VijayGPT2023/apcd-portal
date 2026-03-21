import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type Locale, getTranslation } from '@/lib/i18n';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: 'language-preference',
    },
  ),
);

/**
 * Hook that returns the translation function bound to the current locale.
 * Re-renders the component when locale changes.
 *
 * Usage: const t = useTranslation();
 *        <h1>{t('auth.signIn')}</h1>
 */
export function useTranslation() {
  const locale = useLanguageStore((s) => s.locale);
  return useCallback(
    (key: string, params?: Record<string, string | number>) => getTranslation(locale, key, params),
    [locale],
  );
}
