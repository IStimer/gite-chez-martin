import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { ImageWithAlt } from '../../../types/content';
import { buildImageUrl, getAltText } from '../../../services/imageUrl';
import { CloseIcon } from './GalleryIcons';

interface GalleryGridOverlayProps {
  images: ImageWithAlt[];
  current: number;
  lang: string;
  onClose: () => void;
  onSelect: (idx: number, dir: 'left' | 'right') => void;
}

const GalleryGridOverlay = ({ images, current, lang, onClose, onSelect }: GalleryGridOverlayProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
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
  }, []);

  return (
    <div
      className="gallery__grid-overlay"
      ref={ref}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'fr' ? 'Toutes les images' : 'All images'}
    >
      <button
        type="button"
        className="gallery__grid-close"
        onClick={onClose}
        aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
      >
        <CloseIcon />
      </button>
      <div className="gallery__grid-inner">
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
              key={img.image?.asset?.url ?? `grid-${i}`}
              type="button"
              className={`gallery__grid-item ${i === current ? 'is-active' : ''}`}
              onClick={() => {
                const newDir = i > current ? 'right' : 'left';
                onSelect(i, newDir);
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
  );
};

export default GalleryGridOverlay;
