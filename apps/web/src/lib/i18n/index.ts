import en from './en.json';
import hi from './hi.json';

export type Locale = 'en' | 'hi';

const messages: Record<Locale, typeof en> = { en, hi };

/**
 * Get a nested translation value by dot-notation key.
 * Example: t('auth.signIn') => "Sign In" or "साइन इन करें"
 */
export function getTranslation(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = messages[locale];

  for (const k of keys) {
    if (value === undefined || value === null) return key;
    value = value[k];
  }

  if (typeof value !== 'string') return key;

  // Replace {param} placeholders
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? `{${name}}`));
  }

  return value;
}

export { en, hi };
