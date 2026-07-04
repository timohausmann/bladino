import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  FALLBACK_LANGUAGE,
  getInitialLanguage,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
  type SupportedLanguage,
} from './config';
import { loadLanguageBundles } from './loadLanguageBundles';

export {
  FALLBACK_LANGUAGE,
  getBrowserLanguage,
  getInitialLanguage,
  getStoredLanguage,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './config';

const loadedLanguages = new Set<SupportedLanguage>();
let initPromise: Promise<void> | null = null;

function syncDocumentLanguage(language: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalizeLanguage(language);
  }
}

/** Adds namespace bundles for a language if not already loaded. */
export async function ensureLanguageLoaded(language: SupportedLanguage) {
  if (loadedLanguages.has(language)) return;

  const bundles = await loadLanguageBundles(language);
  for (const [namespace, bundle] of Object.entries(bundles)) {
    i18n.addResourceBundle(language, namespace, bundle, true, true);
  }
  loadedLanguages.add(language);
}

/** Loads the active language and initializes i18next. Call before first render. */
export function initI18n() {
  if (!initPromise) {
    initPromise = (async () => {
      const language = getInitialLanguage();
      const bundles = await loadLanguageBundles(language);
      loadedLanguages.add(language);

      await i18n.use(initReactI18next).init({
        resources: { [language]: bundles },
        lng: language,
        fallbackLng: FALLBACK_LANGUAGE,
        defaultNS: 'common',
        ns: Object.keys(bundles),
        interpolation: {
          escapeValue: false,
        },
      });

      if (language !== FALLBACK_LANGUAGE) {
        void ensureLanguageLoaded(FALLBACK_LANGUAGE);
      }

      i18n.on('languageChanged', (nextLanguage) => {
        localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          normalizeLanguage(nextLanguage),
        );
        syncDocumentLanguage(nextLanguage);
      });

      syncDocumentLanguage(i18n.language);
    })();
  }

  return initPromise;
}

/** Persists and applies a user-selected language (localStorage until backend sync). */
export function setLanguage(language: SupportedLanguage) {
  void (async () => {
    await ensureLanguageLoaded(language);
    await i18n.changeLanguage(language);
  })();
}

export default i18n;
