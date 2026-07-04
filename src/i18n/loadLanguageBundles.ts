import type { SupportedLanguage } from './config';

export type LanguageBundles = Record<string, object>;

const languageLoaders: Record<
  SupportedLanguage,
  () => Promise<{ default: LanguageBundles }>
> = {
  en: () => import('./locales/en'),
  de: () => import('./locales/de'),
};

/** Loads all namespaces for a language as a single chunk. */
export async function loadLanguageBundles(
  language: SupportedLanguage,
): Promise<LanguageBundles> {
  const module = await languageLoaders[language]();
  return module.default;
}
