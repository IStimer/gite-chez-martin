import { sanityClient } from './sanityClient';
import type { SecondaryPage } from '../types/content';

const IMAGE_META = /* groq */ `
  _type,
  hotspot,
  crop,
  "asset": asset->{
    "url": url,
    "lqip": metadata.lqip,
    "dimensions": metadata.dimensions
  }
`;

const PAGE_QUERY = /* groq */ `
  *[_type == "page" && slug.current == $slug][0]{
    _id, _type, title, slug, showInFooter, body,
    "heroImage": heroImage{
      _type, alt, caption,
      "image": image{ ${IMAGE_META} }
    },
    "seo": seo{
      ...,
      "image": image{ ${IMAGE_META} }
    }
  }
`;

export async function fetchPageBySlug(
  slug: string,
): Promise<SecondaryPage | null> {
  try {
    return await sanityClient.fetch<SecondaryPage | null>(PAGE_QUERY, { slug });
  } catch (error) {
    if (import.meta.env.DEV) console.error('Failed to fetch page:', error);
    return null;
  }
}
