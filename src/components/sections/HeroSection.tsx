import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { HeroSection as HeroData } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import { lenisService } from '../../services/lenisService';
import Coquillage from '../Coquillage';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10.5V20h14v-9.5" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17" />
    <path d="M8 3v4M16 3v4" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const DownArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </svg>
);

const HeroSection = ({ data }: { data: HeroData }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const id = data.sectionId || 'accueil';
  const titleRaw = pickLocale(data.title, lang) || '';
  const titleLines = titleRaw.split(/\r?\n/).filter(Boolean);
  const subtitle = pickLocale(data.subtitle, lang);
  const bgUrl = buildImageUrl(data.backgroundImage, { width: 2400, format: 'webp', quality: 82 });
  const lqip = getLqip(data.backgroundImage);
  const alt = getAltText(data.backgroundImage, titleRaw);

  const badge = data.locationBadge;
  const city = pickLocale(badge?.city, lang);
  const region = pickLocale(badge?.region, lang);
  const detailsLabel = pickLocale(badge?.detailsLink?.label, lang) || (lang === 'fr' ? 'Détails' : 'Details');
  const detailsAnchor = badge?.detailsLink?.anchor;

  const onAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) lenisService.scrollTo(el, { offset: -72, duration: 1 });
  };

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from('.hero__card-tl', { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out' })
        .from('.hero__cluster-tr > *', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, '-=0.6')
        .from('.hero__ornament', { opacity: 0, x: -40, duration: 1.0, ease: 'expo.out' }, '-=0.6')
        .from('.hero__title-line', { opacity: 0, y: 60, duration: 1.2, stagger: 0.1, ease: 'expo.out' }, '-=0.7')
        .from('.hero__scroll-btn', { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out' }, '-=0.5');

      // Parallax background — damped scrub to avoid compounding with Lenis
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4,
          },
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-block" ref={rootRef}>
      <section id={id} className="hero">
      {/* Decorative background — absolute so the flex layout can breathe on top */}
      <div
        className="hero__bg"
        ref={bgRef}
        style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
      >
        {bgUrl && (
          <img
            src={bgUrl}
            alt={alt}
            className="hero__bg-image"
            loading="eager"
            decoding="async"
          />
        )}
      </div>
      <div className="hero__overlay" />

      {/* Content layout — grid with 3 rows: cards (auto) / middle (1fr) / title (auto) */}
      <div className="hero__layout">
        {/* Row 1 — top cards */}
        <header className="hero__top">
          {subtitle ? (
            <aside className="hero__card-tl">
              <p>{subtitle}</p>
            </aside>
          ) : (
            <div aria-hidden="true" />
          )}

          <aside className="hero__cluster-tr">
            {(city || region) && (
              <div className="hero__location-pill">
                <span className="hero__location-pin"><PinIcon /></span>
                <div className="hero__location-text">
                  {city && <span className="hero__location-city">{city}</span>}
                  {region && <span className="hero__location-region">{region}</span>}
                </div>
                {detailsAnchor ? (
                  <a
                    href={`#${detailsAnchor}`}
                    className="hero__location-details"
                    onClick={(e) => { e.preventDefault(); onAnchor(detailsAnchor); }}
                  >
                    {detailsLabel}
                  </a>
                ) : (
                  <span className="hero__location-details">{detailsLabel}</span>
                )}
              </div>
            )}
            <div className="hero__tiles">
              <button type="button" className="hero__tile" aria-label="Hébergements" onClick={() => onAnchor('hebergements')}>
                <HouseIcon />
              </button>
              <button type="button" className="hero__tile" aria-label="Tarifs" onClick={() => onAnchor('tarifs')}>
                <CalendarIcon />
              </button>
            </div>
          </aside>
        </header>

        {/* Row 2 — middle: ornament auto-centered in the remaining space */}
        <div className="hero__middle">
          <div className="hero__ornament" aria-hidden="true">
            <Coquillage
              className="hero__ornament-shell"
              variant="rays"
              rotate={90}
            />
            <span className="hero__ornament-line" />
          </div>
        </div>

        {/* Row 3 — title, ferré bas */}
        <div className="hero__bottom">
          <h1 className="hero__title">
            {titleLines.map((line, i) => (
              <span key={i} className="hero__title-line">{line}</span>
            ))}
          </h1>
        </div>
      </div>

      </section>

      {/* Scroll indicator — outside .hero overflow; straddles the hero/section boundary */}
      <button
        type="button"
        className="hero__scroll-btn"
        aria-label="Faire défiler"
        onClick={() => onAnchor('presentation')}
      >
        <span className="hero__scroll-btn-icon" aria-hidden="true">
          <DownArrow />
        </span>
      </button>
    </div>
  );
};

export default HeroSection;
