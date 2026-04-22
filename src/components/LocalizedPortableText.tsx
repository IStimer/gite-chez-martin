import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { useTranslation } from 'react-i18next';
import type { LocalePortableText } from '../types/content';
import { extractBaseLang } from '../i18n/routes';
import { pickLocaleBlocks } from '../i18n/localized';

interface Props {
  value: LocalePortableText | null | undefined;
  className?: string;
  components?: PortableTextComponents;
}

const defaultComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = value?.href ?? '';
      const openInNewTab = value?.openInNewTab;
      return (
        <a
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

const LocalizedPortableText = ({ value, className, components }: Props) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const blocks = pickLocaleBlocks(value, lang);
  if (!blocks.length) return null;
  return (
    <div className={className}>
      <PortableText value={blocks} components={components ?? defaultComponents} />
    </div>
  );
};

export default LocalizedPortableText;
