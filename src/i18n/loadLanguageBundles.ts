import type { SupportedLanguage } from './config';

export const I18N_NAMESPACES = [
  'common',
  'auth',
  'settings',
  'navigation',
  'errors',
  'posts',
  'mail',
  'notes',
  'profile',
  'notifications',
  'presence',
  'dashboard',
  'channels',
] as const;

export type I18nNamespace = (typeof I18N_NAMESPACES)[number];

export type LanguageBundles = Record<I18nNamespace, object>;

/** Loads all namespace JSON files for a language as separate chunks. */
export async function loadLanguageBundles(
  language: SupportedLanguage,
): Promise<LanguageBundles> {
  const entries = await Promise.all(
    I18N_NAMESPACES.map(async (namespace) => {
      const module = await import(`../locales/${language}/${namespace}.json`);
      return [namespace, module.default] as const;
    }),
  );

  return Object.fromEntries(entries) as LanguageBundles;
}
