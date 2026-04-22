import { useTranslation } from 'react-i18next';
import type { LocaleString, LocaleText } from '../types/content';
import { extractBaseLang } from '../i18n/routes';
import { pickLocale } from '../i18n/localized';

interface LocalizedTextProps {
  value: LocaleString | LocaleText | null | undefined;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  fallback?: string;
}

const LocalizedText = ({
  value,
  as: Tag = 'span',
  className,
  fallback = '',
}: LocalizedTextProps) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const text = pickLocale(value, lang) || fallback;
  if (!text) return null;
  return <Tag className={className}>{text}</Tag>;
};

export default LocalizedText;
