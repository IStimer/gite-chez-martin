import { useEffect, useReducer } from 'react';
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

type FetchState =
  | { status: 'loading'; page: null }
  | { status: 'ready'; page: PageType | null };

type FetchAction =
  | { type: 'reset' }
  | { type: 'resolve'; page: PageType | null };

const initialState: FetchState = { status: 'loading', page: null };

const reducer = (state: FetchState, action: FetchAction): FetchState => {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'resolve':
      return { status: 'ready', page: action.page };
    default:
      return state;
  }
};

const SecondaryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!slug) {
      dispatch({ type: 'resolve', page: null });
      return;
    }
    let cancelled = false;
    dispatch({ type: 'reset' });
    fetchPageBySlug(slug).then((p) => {
      if (!cancelled) dispatch({ type: 'resolve', page: p });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === 'loading') return <PageLoader />;
  const page = state.page;
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
