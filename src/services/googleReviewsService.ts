import type { Testimonial } from '../types/content';

// ─────────────────────────────────────────────────────────────────────
// Google Reviews service
//
// Loads the Google Maps JS SDK on demand, fetches the configured Place's
// latest reviews via the Places Library, and normalises them into the
// project's `Testimonial` shape so they can sit next to Sanity entries.
//
// Setup (required):
// 1. Create an API key in Google Cloud Console (Places API + Maps JS API).
// 2. Restrict the key to the production domain (HTTP referrers).
// 3. Set `VITE_GOOGLE_PLACES_API_KEY` in .env.local / production env.
// 4. Fill `siteSettings.googleReviews.placeId` in Sanity Studio.
// ─────────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any;
    __giteMapsCb?: () => void;
  }
}

let mapsLoader: Promise<any> | null = null;

function loadMaps(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Maps JS SDK can only load in a browser context.'));
  }
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsLoader) return mapsLoader;

  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;
  if (!apiKey) {
    return Promise.reject(new Error('Missing VITE_GOOGLE_PLACES_API_KEY.'));
  }

  mapsLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-gite-maps-loader]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    window.__giteMapsCb = () => resolve(window.google.maps);
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&v=weekly&libraries=places&loading=async&callback=__giteMapsCb`;
    s.async = true;
    s.defer = true;
    s.dataset.giteMapsLoader = 'true';
    s.onerror = () => reject(new Error('Failed to load Google Maps JS.'));
    document.head.appendChild(s);
  });

  return mapsLoader;
}

/**
 * Fetch the latest reviews attached to the configured Place, normalised
 * into the project's `Testimonial` shape. Returns `[]` on any failure.
 */
export async function fetchGoogleReviews(
  placeId: string,
  lang: 'fr' | 'en' = 'fr',
): Promise<Testimonial[]> {
  if (!placeId) return [];
  try {
    const maps = await loadMaps();
    const { Place } = await maps.importLibrary('places');
    const place = new Place({ id: placeId, requestedLanguage: lang });
    await place.fetchFields({ fields: ['reviews'] });
    const reviews: any[] = place.reviews ?? [];

    return reviews.map((r, i): Testimonial => {
      const authorName =
        r.authorAttribution?.displayName ?? r.author_name ?? 'Anonymous';
      const text: string = r.text?.text ?? r.text ?? '';
      const rating: number = r.rating ?? 5;
      const avatarUrl: string | undefined =
        r.authorAttribution?.photoURI ?? r.profile_photo_url;
      const publishTime: string | undefined = r.publishTime ?? r.time;
      const relativeTime: string | undefined = r.relativePublishTimeDescription;
      return {
        _id: `google-${placeId}-${i}`,
        _type: 'testimonial',
        authorName,
        origin: relativeTime
          ? { fr: relativeTime, en: relativeTime }
          : null,
        rating,
        body: { fr: text, en: text },
        date: publishTime ?? null,
        avatar: null,
        avatarUrl: avatarUrl ?? null,
        source: 'google',
        published: true,
        externalUrl:
          r.authorAttribution?.uri ?? r.author_url ?? undefined,
      };
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[googleReviews] fetch failed:', err);
    }
    return [];
  }
}
