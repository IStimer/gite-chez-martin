import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frCommon from './locales/fr/common.json';
import enCommon from './locales/en/common.json';

import { DEFAULT_LANG, extractBaseLang } from './routes';

const detectFromUrl = (): string => {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const first = window.location.pathname.split('/').filter(Boolean)[0];
  return extractBaseLang(first ?? navigator.language);
};

i18n.use(initReactI18next).init({
  lng: detectFromUrl(),
  resources: {
    fr: { common: frCommon },
    en: { common: enCommon },
  },
  fallbackLng: DEFAULT_LANG,
  supportedLngs: ['fr', 'en'],
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});
