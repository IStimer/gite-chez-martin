import { urlFor } from './sanityClient';
import type { ImageWithAlt, SanityImage } from '../types/content';

type Source = ImageWithAlt | SanityImage | string | null | undefined;

function resolveAssetSource(src: Source): { url?: string; lqip?: string | null } {
  if (!src) return {};
  if (typeof src === 'string') return { url: src };
  // imageWithAlt
  if ((src as ImageWithAlt)._type === 'imageWithAlt') {
    const inner = (src as ImageWithAlt).image;
    return {
      url: inner?.asset?.url,
      lqip: inner?.asset?.lqip ?? null,
    };
  }
  // bare image
  const img = src as SanityImage;
  return {
    url: img?.asset?.url,
    lqip: img?.asset?.lqip ?? null,
  };
}

export interface ImageUrlOptions {
  width?: number;
  height?: number;
  fit?: 'crop' | 'fill' | 'max' | 'clip';
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}

export function buildImageUrl(src: Source, opts: ImageUrlOptions = {}): string | undefined {
  const { url } = resolveAssetSource(src);
  if (!url) return undefined;
  let b = urlFor(url);
  if (opts.width) b = b.width(opts.width);
  if (opts.height) b = b.height(opts.height);
  if (opts.fit) b = b.fit(opts.fit);
  b = b.quality(opts.quality ?? 85);
  b = b.format(opts.format ?? 'webp');
  return b.url();
}

export function getLqip(src: Source): string | null {
  return resolveAssetSource(src).lqip ?? null;
}

export function getAltText(src: ImageWithAlt | null | undefined, fallback = ''): string {
  if (!src?.alt) return fallback;
  return src.alt.fr ?? src.alt.en ?? fallback;
}
