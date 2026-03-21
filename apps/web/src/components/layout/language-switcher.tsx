'use client';

import type { Locale } from '@/lib/i18n';
import { useLanguageStore } from '@/store/language-store';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageStore();

  const toggleLocale = () => {
    const next: Locale = locale === 'en' ? 'hi' : 'en';
    setLocale(next);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-sm font-medium transition-colors hover:bg-gray-100"
      aria-label={`Switch language to ${locale === 'en' ? 'Hindi' : 'English'}`}
      data-testid="language-switcher"
    >
      <span className="text-base">{locale === 'en' ? 'अ' : 'A'}</span>
      <span className="hidden sm:inline">{locale === 'en' ? 'हिन्दी' : 'English'}</span>
    </button>
  );
}
