export const SUPPORTED_LANGS = ['fr', 'en'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: SupportedLang = 'fr';

export const isSupportedLang = (value: string | undefined): value is SupportedLang =>
  !!value && (SUPPORTED_LANGS as readonly string[]).includes(value);

export const extractBaseLang = (lang: string | undefined): SupportedLang => {
  if (!lang) return DEFAULT_LANG;
  const base = lang.split('-')[0].toLowerCase();
  return isSupportedLang(base) ? base : DEFAULT_LANG;
};

export const localizedHome = (lang: SupportedLang): string => `/${lang}`;
