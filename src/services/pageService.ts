import { sanityClient } from './sanityClient';
import type { Page } from '../types/page';

const PAGE_QUERY = /* groq */ `
  *[_type == "page"][0]{
    title,
    description,
    "heroImage": heroImage{
      ...,
      "asset": asset->{
        "url": url,
        "lqip": metadata.lqip,
        "dimensions": metadata.dimensions
      }
    },
    body
  }
`;

export async function fetchPage(): Promise<Page | null> {
  try {
    return await sanityClient.fetch<Page | null>(PAGE_QUERY);
  } catch (error) {
    if (import.meta.env.DEV) console.error('Failed to fetch page:', error);
    return null;
  }
}
