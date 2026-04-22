import type { PortableTextBlock } from '@portabletext/react';

export interface SanityImageAsset {
  url: string;
  lqip: string | null;
  dimensions: { width: number; height: number; aspectRatio: number } | null;
}

export interface HeroImage {
  asset: SanityImageAsset;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotspot?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  crop?: any;
  // Raw reference kept for urlFor() calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _ref?: any;
}

export interface Page {
  title: string;
  description: string | null;
  heroImage: HeroImage | null;
  body: PortableTextBlock[] | null;
}
