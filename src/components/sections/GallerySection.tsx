import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GallerySection as Data, ImageWithAlt } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import { lenisService } from '../../services/lenisService';
import SectionHeader from './SectionHeader';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const Lightbox = ({
  images,
  index,
  onClose,
  onNavigate,
  lang,
}: {
  images: ImageWithAlt[];
  index: number;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
  lang: 'fr' | 'en';
}) => {
  const current = images[index];
  const url = buildImageUrl(current, { width: 2200, format: 'webp', quality: 90 });
  const alt = getAltText(current, '');
  const caption = pickLocale(current?.caption, lang);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onNavigate]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button
        type="button"
        className="lightbox__close"
        aria-label="Fermer"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        ×
      </button>
      <button
        type="button"
        className="lightbox__nav lightbox__nav--prev"
        aria-label="Précédent"
        onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
      >
        ‹
      </button>
      <figure className="lightbox__frame" onClick={(e) => e.stopPropagation()}>
        {url && <img src={url} alt={alt} />}
        {caption && <figcaption>{caption}</figcaption>}
        <p className="lightbox__counter">{index + 1} / {images.length}</p>
      </figure>
      <button
        type="button"
        className="lightbox__nav lightbox__nav--next"
        aria-label="Suivant"
        onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
      >
        ›
      </button>
    </div>
  );
};

const GallerySection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.gallery__item'), {
        opacity: 0,
        y: 60,
        scale: 0.94,
        duration: 1.2,
        ease: 'expo.out',
        stagger: { each: 0.08, from: 'start' },
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (openIndex !== null) lenisService.stop(); else lenisService.start();
  }, [openIndex]);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((idx) => {
        if (idx === null) return idx;
        const next = idx + dir;
        if (next < 0) return data.images.length - 1;
        if (next >= data.images.length) return 0;
        return next;
      });
    },
    [data.images.length],
  );

  const layout = data.layout ?? 'masonry';

  return (
    <section
      id={data.sectionId || 'galerie'}
      className={`gallery gallery--${layout}`}
      ref={rootRef}
    >
      <div className="container">
        <SectionHeader
          eyebrow={data.eyebrow ?? undefined}
          title={data.title}
          intro={data.intro ?? undefined}
          align="center"
        />

        <div className="gallery__grid">
          {data.images.map((img, i) => {
            const url = buildImageUrl(img, { width: 900, format: 'webp', quality: 82 });
            const lqip = getLqip(img);
            const alt = getAltText(img, '');
            // Masonry: vary row spans for visual interest
            const span = i % 5 === 0 ? 'tall' : i % 7 === 2 ? 'wide' : 'regular';
            return (
              <button
                key={i}
                type="button"
                className={`gallery__item gallery__item--${span}`}
                onClick={() => setOpenIndex(i)}
                aria-label={alt || `Image ${i + 1}`}
                style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
              >
                {url && (
                  <img src={url} alt={alt} loading="lazy" decoding="async" />
                )}
                <span className="gallery__item-hover" aria-hidden="true">
                  <span className="gallery__item-plus">+</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {openIndex !== null && (
        <Lightbox
          images={data.images}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={navigate}
          lang={lang}
        />
      )}
    </section>
  );
};

export default GallerySection;
