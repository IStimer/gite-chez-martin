import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GallerySection as Data } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getAltText } from '../../services/imageUrl';
import GalleryViewer from './gallery/GalleryViewer';
import GalleryGridOverlay from './gallery/GalleryGridOverlay';
import { useGalleryReveals } from './gallery/useGalleryReveals';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const GallerySection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);

  const images = data.images;
  const total = images.length;
  // `base` is always-visible. `overlay` is the transitioning image that
  // animates on top; when its animation ends we promote it to base.
  const [base, setBase] = useState(0);
  const [overlay, setOverlay] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isGrid, setIsGrid] = useState(false);

  const current = overlay ?? base;
  const isTransitioning = overlay !== null;

  const goTo = useCallback(
    (idx: number, dir?: 'left' | 'right') => {
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

  useGalleryReveals(rootRef);

  const eyebrow = pickLocale(data.eyebrow ?? undefined, lang);
  const title = pickLocale(data.title, lang);
  const intro = pickLocale(data.intro ?? undefined, lang);

  const slideUrl = (idx: number) =>
    buildImageUrl(images[idx], { width: 2000, format: 'webp', quality: 88 });
  const slideAlt = (idx: number) => getAltText(images[idx], '');

  const baseImg = images[base];
  const visibleImg = overlay !== null ? images[overlay] : baseImg;
  const caption =
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
              <span>{eyebrow}</span>
            </p>
          )}
          <h2 className="gallery__title">{title}</h2>
          {intro && <p className="gallery__intro">{intro}</p>}
        </header>

        <GalleryViewer
          images={images}
          base={base}
          overlay={overlay}
          current={current}
          direction={direction}
          isTransitioning={isTransitioning}
          baseUrl={slideUrl(base)}
          baseAlt={slideAlt(base)}
          overlayUrl={overlay !== null ? slideUrl(overlay) : undefined}
          overlayAlt={overlay !== null ? slideAlt(overlay) : ''}
          caption={caption}
          lang={lang}
          onOpenGrid={() => setIsGrid(true)}
          onPrev={goPrev}
          onNext={goNext}
          onGoTo={goTo}
          onOverlayEnd={handleOverlayEnd}
        />
      </div>

      {isGrid && (
        <GalleryGridOverlay
          images={images}
          current={current}
          lang={lang}
          onClose={() => setIsGrid(false)}
          onSelect={(idx, dir) => {
            goTo(idx, dir);
            setIsGrid(false);
          }}
        />
      )}
    </section>
  );
};

export default GallerySection;
