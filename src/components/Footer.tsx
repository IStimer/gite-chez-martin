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
    `© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.`;
  const email = site?.email;
  const phone = site?.phone;
  const address = pickLocale(site?.address, lang);
  const footerPages = site?.footerPages ?? [];

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <Coquillage className="footer__mark" />
          <div>
            <p className="footer__name">{siteName}</p>
            {tagline && <p className="footer__tagline">{tagline}</p>}
          </div>
        </div>

        <div className="footer__columns">
          <div className="footer__col">
            <h4 className="footer__title">Contact</h4>
            {email && (
              <a href={`mailto:${email}`} className="footer__link">{email}</a>
            )}
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="footer__link">{phone}</a>
            )}
            {address && <p className="footer__address">{address}</p>}
          </div>

          {footerPages.length > 0 && (
            <div className="footer__col">
              <h4 className="footer__title">Informations</h4>
              {footerPages.map((p) => (
                <Link
                  key={p._id}
                  to={`/${lang}/${p.slug.current}`}
                  className="footer__link"
                >
                  {pickLocale(p.title, lang)}
                </Link>
              ))}
            </div>
          )}

          <div className="footer__col">
            <h4 className="footer__title">Réservation</h4>
            {site?.externalLinks?.airbnb && (
              <a
                href={site.externalLinks.airbnb}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                Airbnb
              </a>
            )}
            {site?.externalLinks?.bookingCom && (
              <a
                href={site.externalLinks.bookingCom}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                Booking.com
              </a>
            )}
            {site?.externalLinks?.googleBusiness && (
              <a
                href={site.externalLinks.googleBusiness}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                Google
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p className="footer__copyright">{copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
