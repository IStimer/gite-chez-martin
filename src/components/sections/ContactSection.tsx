import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ContactSection as Data } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { useSiteSettings } from '../../providers/ContentProvider';
import Coquillage from '../Coquillage';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
const CompassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-1.5 4.5L9 15l1.5-4.5L15 9Z" />
  </svg>
);
const ArrowOut = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </svg>
);

const ContactSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const site = useSiteSettings();
  const rootRef = useRef<HTMLElement | null>(null);

  const email = site?.email;
  const phone = site?.phone;
  const showEmail = data.showEmail !== false && !!email;
  const showPhone = data.showPhone !== false && !!phone;

  const airbnbLabel = pickLocale(data.airbnbCta?.link?.label, lang);
  const airbnbHref =
    data.airbnbCta?.link?.href || site?.externalLinks?.airbnb || null;

  const eyebrow = pickLocale(data.eyebrow ?? undefined, lang);
  const title = pickLocale(data.title, lang);
  const intro = pickLocale(data.intro ?? undefined, lang);
  const notes = pickLocale(data.additionalNotes, lang);
  const address = pickLocale(data.map?.address, lang);
  const directions = pickLocale(data.map?.directions, lang);
  const mapUrl = data.map?.googleMapsEmbedUrl;
  const lat = data.map?.latitude;
  const lng = data.map?.longitude;

  const fallbackMap =
    !mapUrl && typeof lat === 'number' && typeof lng === 'number'
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.012},${lng + 0.02},${lat + 0.012}&layer=mapnik&marker=${lat},${lng}`
      : null;

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 28,
        duration: 1.05,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      // Only animate clip-path, never opacity — avoids the map staying
      // hidden if ScrollTrigger misses the refresh window.
      gsap.fromTo(
        el.querySelector('.contact__map'),
        { clipPath: 'inset(8% 8% 8% 8%)' },
        {
          clipPath: 'inset(0%)',
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        },
      );
      gsap.from(el.querySelector('.contact__mark'), {
        opacity: 0,
        scale: 0.6,
        rotation: -18,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id={data.sectionId || 'contact'}
      className="contact"
      ref={rootRef}
    >
      <Coquillage className="contact__mark" />
      <div className="contact__inner">
        <header className="contact__head">
          {eyebrow && (
            <p className="contact__eyebrow" data-reveal>
              <Coquillage
                className="contact__eyebrow-mark"
                variant="rays"
                rotate={90}
              />
              <span>{eyebrow}</span>
            </p>
          )}
          <h2 className="contact__title" data-reveal>{title}</h2>
          {intro && <p className="contact__intro" data-reveal>{intro}</p>}
        </header>

        <div className="contact__grid">
          {/* Left: Map */}
          <div className="contact__map" data-reveal>
            {mapUrl ? (
              <iframe
                src={mapUrl}
                title="Carte"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : fallbackMap ? (
              <iframe src={fallbackMap} title="Carte" />
            ) : (
              <div className="contact__map-empty">
                <Coquillage className="contact__map-empty-shell" />
              </div>
            )}
          </div>

          {/* Right: info blocks */}
          <div className="contact__info">
            {address && (
              <article className="contact__block" data-reveal>
                <header className="contact__block-head">
                  <span className="contact__block-icon"><PinIcon /></span>
                  <h3>{lang === 'fr' ? 'Adresse' : 'Address'}</h3>
                </header>
                <address className="contact__address">{address}</address>
                {typeof lat === 'number' && typeof lng === 'number' && (
                  <a
                    className="contact__external"
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lang === 'fr' ? 'Ouvrir dans Google Maps' : 'Open in Google Maps'}
                    <ArrowOut />
                  </a>
                )}
              </article>
            )}

            {directions && (
              <article className="contact__block" data-reveal>
                <header className="contact__block-head">
                  <span className="contact__block-icon"><CompassIcon /></span>
                  <h3>{lang === 'fr' ? 'Accès' : 'Getting here'}</h3>
                </header>
                <p className="contact__directions">{directions}</p>
              </article>
            )}

            {(showEmail || showPhone) && (
              <article className="contact__block" data-reveal>
                <header className="contact__block-head">
                  <span className="contact__block-icon"><MailIcon /></span>
                  <h3>Contact</h3>
                </header>
                <div className="contact__methods">
                  {showEmail && (
                    <a className="contact__method" href={`mailto:${email}`}>
                      <span className="contact__method-label">
                        {lang === 'fr' ? 'Écrire un email' : 'Send an email'}
                      </span>
                      <span className="contact__method-value">{email}</span>
                    </a>
                  )}
                  {showPhone && (
                    <a
                      className="contact__method"
                      href={`tel:${phone!.replace(/\s/g, '')}`}
                    >
                      <span className="contact__method-label">
                        {lang === 'fr' ? 'Appeler' : 'Call'}
                      </span>
                      <span className="contact__method-value">{phone}</span>
                    </a>
                  )}
                </div>
              </article>
            )}

            {airbnbHref && (
              <a
                href={airbnbHref}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__airbnb"
                data-reveal
              >
                {airbnbLabel ||
                  (lang === 'fr' ? 'Voir sur Airbnb' : 'View on Airbnb')}
                <ArrowOut />
              </a>
            )}

            {notes && (
              <p className="contact__notes" data-reveal>
                {notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
