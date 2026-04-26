import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { HeroSection as HeroData } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import { lenisService } from '../../services/lenisService';
import { useSiteSettings } from '../../providers/ContentProvider';
import Coquillage from '../Coquillage';
import { HouseIcon, CalendarIcon, PinIcon, DownArrow } from './hero/HeroIcons';
import { useHeroIntro } from './hero/useHeroIntro';

const HeroSection = ({ data }: { data: HeroData }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const site = useSiteSettings();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loaderStageRef = useRef<HTMLDivElement | null>(null);
  const loaderTextRef = useRef<HTMLParagraphElement | null>(null);
  const loaderFrameRef = useRef<HTMLDivElement | null>(null);
  const loaderImageRef = useRef<HTMLImageElement | null>(null);

  const id = data.sectionId || 'accueil';
  const titleRaw = pickLocale(data.title, lang) || '';
  const brand = pickLocale(site?.siteName, lang) || 'Gîte chez Martin';
  const welcomeLines =
    lang === 'fr'
      ? [
          `Bienvenue au ${brand}.`,
          'Un havre sur le chemin de Compostelle.',
          'Prenez le temps, installez-vous.',
        ]
      : [
          `Welcome to ${brand}.`,
          'A haven on the Compostela Way.',
          'Take your time, settle in.',
        ];
  const titleLines = titleRaw.split(/\r?\n/).filter(Boolean);
  const subtitle = pickLocale(data.subtitle, lang);
  // Native asset is 1584w — request just above it so the browser
  // does the final 100vw stretch from a near-1:1 source. Asking
  // Sanity for higher widths just upscales and adds blur.
  const bgUrl = buildImageUrl(data.backgroundImage, {
    width: 1700,
    format: 'webp',
    quality: 92,
  });
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

  useHeroIntro({
    rootRef,
    bgRef,
    loaderRef,
    loaderStageRef,
    loaderTextRef,
    loaderFrameRef,
    loaderImageRef,
  });

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
                  <button
                    type="button"
                    className="hero__location-details hero__location-details--btn"
                    onClick={() => onAnchor(detailsAnchor)}
                  >
                    {detailsLabel}
                  </button>
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
            {titleLines.map((line) => (
              <span key={line} className="hero__title-line">{line}</span>
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

      {/* Loader portaled into body — escapes the hero's stacking
          context so it always sits above the fixed header. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="hero__loader" aria-hidden="true" ref={loaderRef}>
            <div className="hero__loader-stage" ref={loaderStageRef}>
              <p className="hero__loader-text" ref={loaderTextRef}>
                {welcomeLines.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < welcomeLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
              {/* Frame overlays the text zone exactly — its bounds are
                  the stage's bounds, which are driven by the text
                  paragraph sizing. The image inside is clipped
                  initially and sweeps L→R during phase 2. */}
              <div className="hero__loader-frame" ref={loaderFrameRef}>
                {bgUrl && (
                  <img
                    src={bgUrl}
                    alt=""
                    className="hero__loader-image"
                    ref={loaderImageRef}
                    decoding="async"
                  />
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default HeroSection;
