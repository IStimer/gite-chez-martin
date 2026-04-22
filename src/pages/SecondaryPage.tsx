import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import PageLoader from '../components/PageLoader';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocalizedPortableText from '../components/LocalizedPortableText';
import { fetchPageBySlug } from '../services/pageService';
import { extractBaseLang } from '../i18n/routes';
import { pickLocale } from '../i18n/localized';
import type { SecondaryPage as PageType } from '../types/content';

const SecondaryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const [page, setPage] = useState<PageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchPageBySlug(slug)
      .then((p) => {
        if (!cancelled) setPage(p);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <PageLoader />;
  if (!page) return <Navigate to={`/${lang}`} replace />;

  const title = pickLocale(page.title, lang);
  const seoTitle = pickLocale(page.seo?.title ?? undefined, lang) || title;
  const seoDescription =
    pickLocale(page.seo?.description ?? undefined, lang) || undefined;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={`/${lang}/${page.slug.current}`}
      />
      <Header />
      <main className="secondary-page">
        <article className="secondary-page__inner">
          <h1 className="secondary-page__title">{title}</h1>
          <LocalizedPortableText
            value={page.body}
            className="secondary-page__body"
          />
        </article>
      </main>
      <Footer />
    </>
  );
};

export default SecondaryPage;
