import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type Locale, getTranslation } from '@/lib/i18n';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale: Locale) => set({ locale }),
      t: (key: string, params?: Record<string, string | number>) =>
        getTranslation(get().locale, key, params),
    }),
    {
      name: 'language-preference',
    },
  ),
);
