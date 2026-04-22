import { sanityClient } from './sanityClient';
import type { HomePayload, SiteSettings, HomePage } from '../types/content';

// Shared image projection: asset-> deref with LQIP, dims, blurhash
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

const IMAGE_WITH_ALT = /* groq */ `
  _type,
  alt,
  caption,
  "image": image{ ${IMAGE_META} }
`;

const ACCOMMODATION_PROJECTION = /* groq */ `
  _id, _type, name, slug, shortDescription, body,
  "mainImage": mainImage{ ${IMAGE_WITH_ALT} },
  "gallery": gallery[]{ ${IMAGE_WITH_ALT} },
  capacity, bedrooms, beds, bathrooms, surfaceM2,
  equipments, featured, order
`;

const TESTIMONIAL_PROJECTION = /* groq */ `
  _id, _type, authorName, origin, rating, body, date,
  "avatar": avatar{ ${IMAGE_META} },
  source, published, order
`;

const ACTIVITY_PROJECTION = /* groq */ `
  _id, _type, name, slug, category, description,
  "image": image{ ${IMAGE_WITH_ALT} },
  distanceKm, duration, externalUrl, featured, order
`;

const PRICING_PROJECTION = /* groq */ `
  _id, _type, name, startDate, endDate,
  pricePerNight, priceUnit, currency, minNights,
  "accommodation": accommodation->{_id, name},
  includes, notes, order
`;

const SECTION_PROJECTION = /* groq */ `
  _key, _type, enabled, sectionId, eyebrow, title,
  _type == "heroSection" => {
    subtitle, coquillageOverlay, locationBadge,
    "backgroundImage": backgroundImage{ ${IMAGE_WITH_ALT} },
    primaryCta, secondaryCta
  },
  _type == "presentationSection" => {
    body, layout,
    "image": image{ ${IMAGE_WITH_ALT} },
    "wideImage": wideImage{ ${IMAGE_WITH_ALT} },
    "secondaryImage": secondaryImage{ ${IMAGE_WITH_ALT} }
  },
  _type == "accommodationsSection" => {
    intro, layout,
    "accommodations": select(
      count(accommodations) > 0 =>
        accommodations[]->{ ${ACCOMMODATION_PROJECTION} },
      *[_type == "accommodation"] | order(order asc, name.fr asc){ ${ACCOMMODATION_PROJECTION} }
    )
  },
  _type == "gallerySection" => {
    intro, layout,
    "images": images[]{ ${IMAGE_WITH_ALT} }
  },
  _type == "pricingSection" => {
    intro, notes,
    "sideImage": sideImage{ ${IMAGE_WITH_ALT} },
    "periods": select(
      count(periods) > 0 =>
        periods[]->{ ${PRICING_PROJECTION} },
      *[_type == "pricingPeriod"] | order(order asc, startDate asc){ ${PRICING_PROJECTION} }
    )
  },
  _type == "testimonialsSection" => {
    intro, displayMode,
    "testimonials": select(
      count(testimonials) > 0 =>
        testimonials[]->{ ${TESTIMONIAL_PROJECTION} },
      *[_type == "testimonial" && published == true] | order(order asc, date desc){ ${TESTIMONIAL_PROJECTION} }
    )
  },
  _type == "activitiesSection" => {
    intro, layout,
    "activities": select(
      count(activities) > 0 =>
        activities[]->{ ${ACTIVITY_PROJECTION} },
      *[_type == "activity"] | order(order asc, name.fr asc){ ${ACTIVITY_PROJECTION} }
    )
  },
  _type == "locationSection" => {
    intro, map,
    "image": image{ ${IMAGE_WITH_ALT} }
  },
  _type == "contactSection" => {
    intro, map, showEmail, showPhone, airbnbCta, additionalNotes
  }
`;

const HOME_QUERY = /* groq */ `
  {
    "siteSettings": *[_id == "siteSettings"][0]{
      ...,
      "logo": logo{ ${IMAGE_META} },
      "coquillageIcon": coquillageIcon{ ${IMAGE_META} },
      "favicon": favicon{ ${IMAGE_META} },
      "socialImage": socialImage{ ${IMAGE_META} },
      "defaultSeo": defaultSeo{
        ...,
        "image": image{ ${IMAGE_META} }
      },
      "footerPages": *[_type == "page" && showInFooter == true]{
        _id, _type, title, slug
      }
    },
    "homePage": *[_id == "homePage"][0]{
      _id, _type,
      "sections": sections[]{ ${SECTION_PROJECTION} },
      "seo": seo{
        ...,
        "image": image{ ${IMAGE_META} }
      }
    }
  }
`;

export async function fetchHomePayload(): Promise<HomePayload> {
  try {
    const data = await sanityClient.fetch<{
      siteSettings: SiteSettings | null;
      homePage: HomePage | null;
    }>(HOME_QUERY);
    return {
      siteSettings: data?.siteSettings ?? null,
      homePage: data?.homePage ?? null,
    };
  } catch (error) {
    if (import.meta.env.DEV) console.error('Failed to fetch home payload:', error);
    return { siteSettings: null, homePage: null };
  }
}
