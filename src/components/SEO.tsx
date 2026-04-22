import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  extractBaseLang,
  isSupportedLang,
  localizedHome,
  type SupportedLang,
} from '../i18n/routes';
import { pickLocale } from '../i18n/localized';
import { urlFor } from '../services/sanityClient';
import { useSiteSettings, useHomePage } from '../providers/ContentProvider';

const LOCALE_MAP: Record<SupportedLang, string> = {
  fr: 'fr_FR',
  en: 'en_US',
};

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}

const getSiteUrl = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://gite-chez-martin.fr';
};

const SEO = ({ title: titleProp, description: descProp, path, image, type = 'website' }: SEOProps) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n, t } = useTranslation();
  const currentLang: SupportedLang = isSupportedLang(lang) ? lang : extractBaseLang(i18n.language) ?? DEFAULT_LANG;

  const siteSettings = useSiteSettings();
  const homePage = useHomePage();

  const siteName = pickLocale(siteSettings?.siteName, currentLang) || 'Gîte chez Martin';
  const seoTitle =
    titleProp ||
    pickLocale(homePage?.seo?.title, currentLang) ||
    pickLocale(siteSettings?.defaultSeo?.title, currentLang) ||
    pickLocale(siteSettings?.tagline, currentLang) ||
    siteName ||
    t('meta.title');
  const seoDescription =
    descProp ||
    pickLocale(homePage?.seo?.description, currentLang) ||
    pickLocale(siteSettings?.defaultSeo?.description, currentLang) ||
    t('meta.description');

  const seoImageAsset =
    homePage?.seo?.image?.asset?.url ||
    siteSettings?.defaultSeo?.image?.asset?.url ||
    siteSettings?.socialImage?.asset?.url ||
    null;
  const seoImage = image || (seoImageAsset
    ? urlFor(seoImageAsset).width(1200).height(630).fit('crop').format('webp').quality(85).url()
    : undefined);

  const siteUrl = getSiteUrl();
  const fullTitle = seoTitle === siteName ? siteName : `${seoTitle} | ${siteName}`;
  const url = `${siteUrl}${path ?? localizedHome(currentLang)}`;
  const noIndex = homePage?.seo?.noIndex ?? siteSettings?.defaultSeo?.noIndex ?? false;

  const org = siteSettings?.organizationSchema;

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={homePage?.seo?.canonicalUrl || url} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {siteSettings?.favicon?.asset?.url && (
        <link rel="icon" href={siteSettings.favicon.asset.url} />
      )}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={LOCALE_MAP[currentLang]} />
      <meta property="og:site_name" content={siteName} />
      {seoImage && <meta property="og:image" content={seoImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={seoDescription} />
      {seoImage && <meta name="twitter:image" content={seoImage} />}

      {SUPPORTED_LANGS.map((l) => (
        <link
          key={l}
          rel="alternate"
          hrefLang={l}
          href={`${siteUrl}${localizedHome(l)}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${localizedHome(DEFAULT_LANG)}`} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          name: org?.legalName || siteName,
          url: siteUrl,
          description: seoDescription,
          telephone: siteSettings?.phone || undefined,
          email: siteSettings?.email || undefined,
          priceRange: org?.priceRange || undefined,
          ...(org?.latitude && org?.longitude
            ? {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: org.latitude,
                  longitude: org.longitude,
                },
              }
            : {}),
          ...(siteSettings?.externalLinks?.airbnb || siteSettings?.externalLinks?.googleBusiness
            ? {
                sameAs: [
                  siteSettings?.externalLinks?.airbnb,
                  siteSettings?.externalLinks?.googleBusiness,
                  siteSettings?.externalLinks?.bookingCom,
                ].filter(Boolean),
              }
            : {}),
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
