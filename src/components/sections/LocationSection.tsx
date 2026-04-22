import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LocationSection as Data } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import SectionHeader from './SectionHeader';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const LocationSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);

  const address = pickLocale(data.map?.address, lang);
  const directions = pickLocale(data.map?.directions, lang);
  const mapUrl = data.map?.googleMapsEmbedUrl;
  const lat = data.map?.latitude;
  const lng = data.map?.longitude;
  const fallbackMap =
    !mapUrl && typeof lat === 'number' && typeof lng === 'number'
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05},${lat - 0.03},${lng + 0.05},${lat + 0.03}&layer=mapnik&marker=${lat},${lng}`
      : null;

  const imageUrl = buildImageUrl(data.image, { width: 1200, height: 800, fit: 'crop', format: 'webp' });
  const lqip = getLqip(data.image);
  const alt = getAltText(data.image, '');

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id={data.sectionId || 'acces'} className="location" ref={rootRef}>
      <div className="container">
        <SectionHeader
          eyebrow={data.eyebrow ?? undefined}
          title={data.title}
          intro={data.intro ?? undefined}
          align="left"
        />
        <div className="location__grid">
          <div className="location__info" data-reveal>
            {address && (
              <div className="location__block">
                <h3>Adresse</h3>
                <address>{address}</address>
              </div>
            )}
            {directions && (
              <div className="location__block">
                <h3>Indications d'accès</h3>
                <p>{directions}</p>
              </div>
            )}
            {typeof lat === 'number' && typeof lng === 'number' && (
              <div className="location__block">
                <h3>Coordonnées GPS</h3>
                <p className="location__gps">
                  {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
                </p>
                <a
                  className="location__external"
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ouvrir dans Google Maps ↗
                </a>
              </div>
            )}
          </div>

          <div className="location__map" data-reveal>
            {mapUrl ? (
              <iframe
                src={mapUrl}
                title="Carte"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : fallbackMap ? (
              <iframe
                src={fallbackMap}
                title="Carte"
                loading="lazy"
              />
            ) : imageUrl ? (
              <div
                className="location__map-fallback"
                style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
              >
                <img src={imageUrl} alt={alt} loading="lazy" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
