import type { ImageWithAlt } from '../../../types/content';
import { buildImageUrl } from '../../../services/imageUrl';
import { ChevronLeft, ChevronRight } from './GalleryIcons';

interface GalleryViewerProps {
  images: ImageWithAlt[];
  base: number;
  overlay: number | null;
  current: number;
  direction: 'left' | 'right';
  isTransitioning: boolean;
  baseUrl: string | undefined;
  baseAlt: string;
  overlayUrl: string | undefined;
  overlayAlt: string;
  caption: string | undefined;
  lang: string;
  onOpenGrid: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (idx: number) => void;
  onOverlayEnd: () => void;
}

const GalleryViewer = ({
  images,
  base: _base,
  overlay,
  current,
  direction,
  isTransitioning,
  baseUrl,
  baseAlt,
  overlayUrl,
  overlayAlt,
  caption,
  lang,
  onOpenGrid,
  onPrev,
  onNext,
  onGoTo,
  onOverlayEnd,
}: GalleryViewerProps) => {
  const total = images.length;

  return (
    <div className="gallery__viewer" data-viewer-reveal data-no-reveal>
      <div
        className="gallery__stage"
        role="button"
        tabIndex={0}
        aria-label={lang === 'fr' ? 'Voir toutes les images' : 'See all images'}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button, .gallery__controls')) return;
          onOpenGrid();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenGrid();
          }
        }}
      >
        <img
          className="gallery__slide gallery__slide--base"
          src={baseUrl}
          alt={baseAlt}
          decoding="async"
        />

        {overlay !== null && overlayUrl && (
          <img
            key={`overlay-${overlay}-${direction}`}
            className={`gallery__slide gallery__slide--overlay gallery__slide--${direction}`}
            src={overlayUrl}
            alt={overlayAlt}
            decoding="async"
            onAnimationEnd={onOverlayEnd}
          />
        )}

        <div className="gallery__controls">
          <span className="gallery__counter">
            <span className="gallery__counter-num">{String(current + 1).padStart(2, '0')}</span>
            <span className="gallery__counter-sep">/</span>
            <span className="gallery__counter-total">{String(total).padStart(2, '0')}</span>
          </span>
          <div className="gallery__arrows">
            <button
              type="button"
              className="gallery__arrow"
              onClick={onPrev}
              disabled={isTransitioning}
              aria-label={lang === 'fr' ? 'Précédent' : 'Previous'}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="gallery__arrow"
              onClick={onNext}
              disabled={isTransitioning}
              aria-label={lang === 'fr' ? 'Suivant' : 'Next'}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {caption && (
          <figcaption className="gallery__caption">
            <span className="gallery__caption-text">{caption}</span>
          </figcaption>
        )}

        <span className="gallery__view-all-hint" aria-hidden="true">
          {lang === 'fr' ? 'Voir toutes les photos' : 'View all photos'}
        </span>
      </div>

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
              key={img.image?.asset?.url ?? `thumb-${i}`}
              type="button"
              className={`gallery__thumb ${i === current ? 'is-active' : ''}`}
              onClick={() => onGoTo(i)}
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
  );
};

export default GalleryViewer;
