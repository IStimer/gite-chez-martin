import { useTranslation } from 'react-i18next';
import type { LocaleString, LocaleText } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';

interface Props {
  eyebrow?: LocaleString | null;
  title: LocaleString;
  intro?: LocaleText | null;
  align?: 'left' | 'center';
  variant?: 'default' | 'panel';
}

const SectionHeader = ({ eyebrow, title, intro, align = 'left', variant = 'default' }: Props) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const eyebrowText = pickLocale(eyebrow, lang);
  const titleText = pickLocale(title, lang);
  const introText = pickLocale(intro, lang);

  return (
    <header className={`section-header section-header--${align} section-header--${variant}`}>
      {eyebrowText && (
        <p className="section-header__eyebrow" data-reveal>
          <span className="section-header__eyebrow-line" />
          <span>{eyebrowText}</span>
        </p>
      )}
      <h2 className="section-header__title" data-reveal>{titleText}</h2>
      {introText && (
        <p className="section-header__intro" data-reveal>{introText}</p>
      )}
    </header>
  );
};

export default SectionHeader;
