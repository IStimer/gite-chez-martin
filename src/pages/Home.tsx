import SEO from '../components/SEO';
import PageLoader from '../components/PageLoader';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionRenderer from '../components/sections/SectionRenderer';
import { useContent } from '../providers/ContentProvider';

const Home = () => {
  const { homePage, siteSettings, loading, error } = useContent();

  if (loading) return <PageLoader />;

  if (error || !homePage) {
    return (
      <main className="home">
        <Header />
        <div
          style={{
            paddingTop: 'calc(var(--header-height) + 120px)',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '200px 24px',
          }}
        >
          <h1>Contenu indisponible</h1>
          <p style={{ color: 'var(--color-muted)', marginTop: 16 }}>
            Merci de réessayer dans un instant.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEO />
      <Header />
      <main className="home" data-has-settings={!!siteSettings}>
        <SectionRenderer sections={homePage.sections ?? []} />
      </main>
      <Footer />
    </>
  );
};

export default Home;
