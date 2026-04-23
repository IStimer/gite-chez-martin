import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../providers/ContentProvider';
import { extractBaseLang } from '../i18n/routes';
import { pickLocale } from '../i18n/localized';
import Coquillage from './Coquillage';

const Footer = () => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const site = useSiteSettings();

  const siteName = pickLocale(site?.siteName, lang) || 'Gîte chez Martin';
  const tagline = pickLocale(site?.tagline, lang);
  const copyright =
    pickLocale(site?.copyright, lang) ||
    `© ${new Date().getFullYear()} ${siteName}`;
  const email = site?.email;
  const phone = site?.phone;
  const address = pickLocale(site?.address, lang);
  const footerPages = site?.footerPages ?? [];

  return (
    <footer className="footer">
      <Coquillage className="footer__watermark" />

      <div className="footer__inner">
        {/* ── Wordmark ─────────────────────────────────────── */}
        <div className="footer__wordmark">
          <h2 className="footer__name" aria-label={siteName}>
            {siteName}
          </h2>
          {tagline && <p className="footer__tagline">{tagline}</p>}
        </div>

        {/* ── Ornamental divider (coquillage + diamond + lines) ── */}
        <div className="footer__ornament" aria-hidden="true">
          <span className="footer__ornament-line" />
          <Coquillage
            className="footer__ornament-shell"
            variant="full"
          />
          <span className="footer__ornament-diamond">✦</span>
          <Coquillage
            className="footer__ornament-shell"
            variant="full"
          />
          <span className="footer__ornament-line" />
        </div>

        {/* ── Columns ───────────────────────────────────────── */}
        <nav className="footer__columns" aria-label="Footer">
          <section className="footer__col">
            <h3 className="footer__col-title">Contact</h3>
            <ul className="footer__list">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="footer__link">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="footer__link"
                  >
                    {phone}
                  </a>
                </li>
              )}
            </ul>
            {address && (
              <p className="footer__address">{address}</p>
            )}
          </section>

          <section className="footer__col">
            <h3 className="footer__col-title">
              {lang === 'fr' ? 'Réserver' : 'Book'}
            </h3>
            <ul className="footer__list">
              {site?.externalLinks?.airbnb && (
                <li>
                  <a
                    href={site.externalLinks.airbnb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__link"
                  >
                    Airbnb
                  </a>
                </li>
              )}
              {site?.externalLinks?.bookingCom && (
                <li>
                  <a
                    href={site.externalLinks.bookingCom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__link"
                  >
                    Booking.com
                  </a>
                </li>
              )}
              {site?.externalLinks?.googleBusiness && (
                <li>
                  <a
                    href={site.externalLinks.googleBusiness}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__link"
                  >
                    Google Business
                  </a>
                </li>
              )}
            </ul>
          </section>

          {footerPages.length > 0 && (
            <section className="footer__col">
              <h3 className="footer__col-title">
                {lang === 'fr' ? 'Informations' : 'Information'}
              </h3>
              <ul className="footer__list">
                {footerPages.map((p) => (
                  <li key={p._id}>
                    <Link
                      to={`/${lang}/${p.slug.current}`}
                      className="footer__link"
                    >
                      {pickLocale(p.title, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="footer__col footer__col--lang">
            <h3 className="footer__col-title">
              {lang === 'fr' ? 'Langue' : 'Language'}
            </h3>
            <ul className="footer__list footer__list--inline">
              <li>
                <Link
                  to="/fr"
                  className={`footer__link${lang === 'fr' ? ' is-active' : ''}`}
                >
                  FR
                </Link>
              </li>
              <li>
                <Link
                  to="/en"
                  className={`footer__link${lang === 'en' ? ' is-active' : ''}`}
                >
                  EN
                </Link>
              </li>
            </ul>
          </section>
        </nav>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">{copyright}</p>
        <p className="footer__credit">
          {lang === 'fr' ? 'Design & développement — ' : 'Design & development — '}
          <a
            href="mailto:bonjour@atypica.digital"
            className="footer__credit-link"
          >
            Atypica
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
