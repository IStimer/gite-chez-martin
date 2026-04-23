import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GallerySection as Data } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getAltText } from '../../services/imageUrl';
import Coquillage from '../Coquillage';
import { revealTitle, revealAllInside, revertReveals } from '../../utils/reveals';
import type { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 6L9 12l6 6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const GallerySection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);
  const gridOverlayRef = useRef<HTMLDivElement | null>(null);

  const images = data.images;
  const total = images.length;
  // `base` is always-visible. `overlay` is the transitioning image that
  // animates on top; when its animation ends we promote it to base.
  const [base, setBase] = useState(0);
  const [overlay, setOverlay] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isGrid, setIsGrid] = useState(false);

  // `current` is the user-visible index (overlay if transitioning, else base)
  const current = overlay ?? base;
  // A transition is running whenever an overlay slide is mounted.
  const isTransitioning = overlay !== null;

  const goTo = useCallback(
    (idx: number, dir?: 'left' | 'right') => {
      // Block any nav while an animation is in progress — prevents the
      // glitchy "animation restarts from 0" on rapid clicks.
      if (isTransitioning) return;
      if (idx === current || idx < 0 || idx >= total) return;
      setDirection(dir ?? (idx > current ? 'right' : 'left'));
      setOverlay(idx);
    },
    [isTransitioning, current, total],
  );

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total, 'left');
  }, [current, total, goTo]);

  const goNext = useCallback(() => {
    goTo((current + 1) % total, 'right');
  }, [current, total, goTo]);

  const handleOverlayEnd = useCallback(() => {
    if (overlay !== null) {
      setBase(overlay);
      setOverlay(null);
    }
  }, [overlay]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isGrid) {
        if (e.key === 'Escape') setIsGrid(false);
        return;
      }
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, isGrid]);

  // Body scroll lock in grid mode
  useEffect(() => {
    if (isGrid) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGrid]);

  // Section header reveal
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const t = revealTitle(el.querySelector<HTMLElement>('.gallery__title'), {
        trigger: el,
      });
      if (t) splits.push(t.split);
      splits.push(...revealAllInside(el));
      gsap.from(el.querySelectorAll('.gallery__head [data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      gsap.from(el.querySelectorAll('[data-viewer-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      });
    }, el);
    return () => {
      revertReveals(splits);
      ctx.revert();
    };
  }, []);

  // Grid overlay stagger on open
  useEffect(() => {
    if (!isGrid) return;
    const el = gridOverlayRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.gallery__grid-item');
    gsap.fromTo(
      items,
      { opacity: 0, y: 24, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'expo.out',
        stagger: 0.04,
      },
    );
  }, [isGrid]);

  const eyebrow = pickLocale(data.eyebrow ?? undefined, lang);
  const title = pickLocale(data.title, lang);
  const intro = pickLocale(data.intro ?? undefined, lang);

  const slideUrl = (idx: number) =>
    buildImageUrl(images[idx], {
      width: 2000,
      format: 'webp',
      quality: 88,
    });
  const slideAlt = (idx: number) => getAltText(images[idx], '');

  const baseImg = images[base];
  const baseUrl = slideUrl(base);
  const baseAlt = slideAlt(base);
  const overlayUrl = overlay !== null ? slideUrl(overlay) : undefined;
  const overlayAlt = overlay !== null ? slideAlt(overlay) : '';

  const visibleImg = overlay !== null ? images[overlay] : baseImg;
  const currentCaption =
    pickLocale(visibleImg?.caption ?? undefined, lang) || slideAlt(current);

  return (
    <section
      id={data.sectionId || 'galerie'}
      className="gallery"
      ref={rootRef}
    >
      <div className="gallery__inner">
        <header className="gallery__head">
          {eyebrow && (
            <p className="gallery__eyebrow" data-reveal>
              <Coquillage
                className="gallery__eyebrow-mark"
                variant="rays"
                rotate={90}
              />
              <span>{eyebrow}</span>
            </p>
          )}
          <h2 className="gallery__title">
            {title}
          </h2>
          {intro && (
            <p className="gallery__intro">
              {intro}
            </p>
          )}
        </header>

        <div className="gallery__viewer" data-viewer-reveal data-no-reveal>
          {/* Top: main stage */}
          <div
            className="gallery__stage"
            role="button"
            tabIndex={0}
            aria-label={lang === 'fr' ? 'Voir toutes les images' : 'See all images'}
            onClick={() => setIsGrid(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsGrid(true);
              }
            }}
          >
            {/* Base slide — always fully visible; stays during overlay transitions */}
            <img
              className="gallery__slide gallery__slide--base"
              src={baseUrl}
              alt={baseAlt}
              decoding="async"
            />

            {/* Overlay slide — animates in on top of the base via clip-path,
                then replaces the base (handled in onAnimationEnd) */}
            {overlay !== null && overlayUrl && (
              <img
                key={`overlay-${overlay}-${direction}`}
                className={`gallery__slide gallery__slide--overlay gallery__slide--${direction}`}
                src={overlayUrl}
                alt={overlayAlt}
                decoding="async"
                onAnimationEnd={handleOverlayEnd}
              />
            )}

            {/* Controls bottom-right (stopPropagation so click doesn't toggle grid) */}
            <div
              className="gallery__controls"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="gallery__counter">
                <span className="gallery__counter-num">{String(current + 1).padStart(2, '0')}</span>
                <span className="gallery__counter-sep">/</span>
                <span className="gallery__counter-total">{String(total).padStart(2, '0')}</span>
              </span>
              <div className="gallery__arrows">
                <button
                  type="button"
                  className="gallery__arrow"
                  onClick={goPrev}
                  disabled={isTransitioning}
                  aria-label={lang === 'fr' ? 'Précédent' : 'Previous'}
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  className="gallery__arrow"
                  onClick={goNext}
                  disabled={isTransitioning}
                  aria-label={lang === 'fr' ? 'Suivant' : 'Next'}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            {currentCaption && (
              <figcaption className="gallery__caption">
                <span className="gallery__caption-text">{currentCaption}</span>
              </figcaption>
            )}

            <span
              className="gallery__view-all-hint"
              aria-hidden="true"
            >
              {lang === 'fr' ? 'Voir toutes les photos' : 'View all photos'}
            </span>
          </div>

          {/* Below: horizontal thumbnails row */}
          <aside
            className="gallery__thumbs"
            aria-label={lang === 'fr' ? 'Miniatures' : 'Thumbnails'}
          >
            {images.map((img, i) => {
              const thumbUrl = buildImageUrl(img, {
                width: 180,
                height: 240,
                fit: 'crop',
                format: 'webp',
                quality: 80,
              });
              return (
                <button
                  key={i}
                  type="button"
                  className={`gallery__thumb ${i === current ? 'is-active' : ''}`}
                  onClick={() => goTo(i)}
                  disabled={isTransitioning && i !== current}
                  aria-label={`${lang === 'fr' ? 'Image' : 'Image'} ${i + 1}`}
                  aria-current={i === current}
                >
                  {thumbUrl && <img src={thumbUrl} alt="" loading="lazy" />}
                </button>
              );
            })}
          </aside>
        </div>
      </div>

      {/* Grid takeover when clicking the main image */}
      {isGrid && (
        <div
          className="gallery__grid-overlay"
          ref={gridOverlayRef}
          onClick={() => setIsGrid(false)}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'fr' ? 'Toutes les images' : 'All images'}
        >
          <button
            type="button"
            className="gallery__grid-close"
            onClick={(e) => { e.stopPropagation(); setIsGrid(false); }}
            aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
          >
            <CloseIcon />
          </button>
          <div
            className="gallery__grid-inner"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => {
              const url = buildImageUrl(img, {
                width: 900,
                height: 900,
                fit: 'crop',
                format: 'webp',
                quality: 84,
              });
              const alt = getAltText(img, '');
              return (
                <button
                  key={i}
                  type="button"
                  className={`gallery__grid-item ${i === current ? 'is-active' : ''}`}
                  onClick={() => {
                    const newDir = i > current ? 'right' : 'left';
                    goTo(i, newDir);
                    setIsGrid(false);
                  }}
                  aria-label={`${lang === 'fr' ? 'Image' : 'Image'} ${i + 1}`}
                >
                  {url && <img src={url} alt={alt} loading="lazy" />}
                  <span className="gallery__grid-item-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
