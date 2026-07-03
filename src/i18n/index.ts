import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from '@/locales/en/auth.json';
import enCommon from '@/locales/en/common.json';
import enErrors from '@/locales/en/errors.json';
import enMail from '@/locales/en/mail.json';
import enNavigation from '@/locales/en/navigation.json';
import enNotes from '@/locales/en/notes.json';
import enNotifications from '@/locales/en/notifications.json';
import enPosts from '@/locales/en/posts.json';
import enChannels from '@/locales/en/channels.json';
import enPresence from '@/locales/en/presence.json';
import enProfile from '@/locales/en/profile.json';
import enSettings from '@/locales/en/settings.json';
import deAuth from '@/locales/de/auth.json';
import deCommon from '@/locales/de/common.json';
import deErrors from '@/locales/de/errors.json';
import deMail from '@/locales/de/mail.json';
import deNavigation from '@/locales/de/navigation.json';
import deNotes from '@/locales/de/notes.json';
import deNotifications from '@/locales/de/notifications.json';
import dePosts from '@/locales/de/posts.json';
import deChannels from '@/locales/de/channels.json';
import dePresence from '@/locales/de/presence.json';
import deProfile from '@/locales/de/profile.json';
import deSettings from '@/locales/de/settings.json';

import {
  FALLBACK_LANGUAGE,
  getInitialLanguage,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
  type SupportedLanguage,
} from './config';

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

const namespaces = [
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
  'channels',
] as const;

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
      settings: enSettings,
      navigation: enNavigation,
      errors: enErrors,
      posts: enPosts,
      mail: enMail,
      notes: enNotes,
      profile: enProfile,
      notifications: enNotifications,
      presence: enPresence,
      channels: enChannels,
    },
    de: {
      common: deCommon,
      auth: deAuth,
      settings: deSettings,
      navigation: deNavigation,
      errors: deErrors,
      posts: dePosts,
      mail: deMail,
      notes: deNotes,
      profile: deProfile,
      notifications: deNotifications,
      presence: dePresence,
      channels: deChannels,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: 'common',
  ns: [...namespaces],
  interpolation: {
    escapeValue: false,
  },
});

function syncDocumentLanguage(language: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalizeLanguage(language);
  }
}

i18n.on('languageChanged', (language) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
  syncDocumentLanguage(language);
});

syncDocumentLanguage(i18n.language);

/** Persists and applies a user-selected language (localStorage until backend sync). */
export function setLanguage(language: SupportedLanguage) {
  void i18n.changeLanguage(language);
}

export default i18n;
