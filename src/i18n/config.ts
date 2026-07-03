export const LANGUAGE_STORAGE_KEY = 'language';

export const SUPPORTED_LANGUAGES = ['en', 'de'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

export function isSupportedLanguage(
  value: string | null | undefined,
): value is SupportedLanguage {
  return value === 'en' || value === 'de';
}

/** Reads persisted language from localStorage. */
export function getStoredLanguage(): SupportedLanguage | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(stored) ? stored : null;
}

/** Maps browser locale to a supported language, defaulting to English. */
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') return FALLBACK_LANGUAGE;
  const primary = navigator.language.split('-')[0];
  return primary === 'de' ? 'de' : FALLBACK_LANGUAGE;
}

export function getInitialLanguage(): SupportedLanguage {
  return getStoredLanguage() ?? getBrowserLanguage();
}

export function normalizeLanguage(language: string): SupportedLanguage {
  const primary = language.split('-')[0];
  return isSupportedLanguage(primary) ? primary : FALLBACK_LANGUAGE;
}
