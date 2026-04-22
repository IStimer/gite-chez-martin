import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  isSupportedLang,
  localizedHome,
  type SupportedLang,
} from '../i18n/routes';

const SITE_NAME = 'Gîte chez Martin';
const SITE_URL = 'https://example.com';

const LOCALE_MAP: Record<SupportedLang, string> = {
  fr: 'fr_FR',
  en: 'en_US',
};

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}

const SEO = ({ title, description, path, image, type = 'website' }: SEOProps) => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang: SupportedLang = isSupportedLang(lang) ? lang : DEFAULT_LANG;

  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path ?? localizedHome(currentLang)}`;

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={LOCALE_MAP[currentLang]} />
      <meta property="og:site_name" content={SITE_NAME} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {SUPPORTED_LANGS.map((l) => (
        <link
          key={l}
          rel="alternate"
          hrefLang={l}
          href={`${SITE_URL}${localizedHome(l)}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${localizedHome(DEFAULT_LANG)}`} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          name: SITE_NAME,
          url: SITE_URL,
          description,
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
