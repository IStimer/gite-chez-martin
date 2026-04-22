import type { LocaleString, LocaleText, LocalePortableText } from '../types/content';
import type { SupportedLang } from './routes';

/**
 * Pick the best-matching translation for a localized field.
 * Falls back to French if the target language is missing.
 */
export function pickLocale(
  value: LocaleString | LocaleText | null | undefined,
  lang: SupportedLang,
): string {
  if (!value) return '';
  if (lang === 'en' && value.en && value.en.trim()) return value.en;
  return value.fr ?? '';
}

export function pickLocaleBlocks(
  value: LocalePortableText | null | undefined,
  lang: SupportedLang,
) {
  if (!value) return [];
  if (lang === 'en' && value.en && value.en.length) return value.en;
  return value.fr ?? [];
}
