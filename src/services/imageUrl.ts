import { urlFor } from './sanityClient';
import type { ImageWithAlt, SanityImage } from '../types/content';

type Source = ImageWithAlt | SanityImage | string | null | undefined;

function resolveAssetSource(src: Source): { url?: string; lqip?: string | null } {
  if (!src) return {};
  if (typeof src === 'string') return { url: src };
  // imageWithAlt — detected via the nested `image.asset` shape rather
  // than the `_type` field, because Sanity doesn't always persist the
  // `_type` on object-type fields (we've seen documents with a valid
  // asset but `_type: null`, which would fall through to the "bare
  // SanityImage" branch and lose the URL).
  const asImageWithAlt = src as ImageWithAlt;
  if (asImageWithAlt.image?.asset) {
    return {
      url: asImageWithAlt.image.asset.url,
      lqip: asImageWithAlt.image.asset.lqip ?? null,
    };
  }
  // bare SanityImage
  const img = src as SanityImage;
  return {
    url: img?.asset?.url,
    lqip: img?.asset?.lqip ?? null,
  };
}

interface ImageUrlOptions {
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
