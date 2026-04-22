import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PortableText } from '@portabletext/react';
import SEO from '../components/SEO';
import PageLoader from '../components/PageLoader';
import { urlFor } from '../services/sanityClient';
import { fetchPage } from '../services/pageService';
import type { Page } from '../types/page';

const Home = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPage()
      .then((data) => {
        if (!cancelled) setPage(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <PageLoader />;

  const title = page?.title ?? t('meta.title');
  const description = page?.description ?? t('meta.description');

  const heroUrl = page?.heroImage
    ? urlFor(page.heroImage).width(1920).format('webp').quality(85).url()
    : undefined;
  const heroLqip = page?.heroImage?.asset.lqip ?? undefined;

  return (
    <main className="home">
      <SEO
        title={title}
        description={description}
        image={heroUrl}
      />

      {heroUrl && (
        <div
          className="home__hero"
          style={heroLqip ? { backgroundImage: `url(${heroLqip})` } : undefined}
        >
          <img
            className={`home__hero-image ${heroLoaded ? 'is-loaded' : ''}`}
            src={heroUrl}
            alt=""
            onLoad={() => setHeroLoaded(true)}
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      <section className="home__content">
        <h1 className="home__title">{title}</h1>
        {description && <p className="home__description">{description}</p>}
        {page?.body && (
          <div className="home__body">
            <PortableText value={page.body} />
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
