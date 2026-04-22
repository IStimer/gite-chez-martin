import type { PortableTextBlock } from '@portabletext/react';

// ──────────────────────────────────────────────────────────────
// Primitives
// ──────────────────────────────────────────────────────────────

export interface LocaleString {
  fr: string;
  en?: string;
}

export interface LocaleText {
  fr: string;
  en?: string;
}

export interface LocalePortableText {
  fr: PortableTextBlock[];
  en?: PortableTextBlock[];
}

export interface SanityImageAssetMeta {
  url: string;
  lqip: string | null;
  dimensions: { width: number; height: number; aspectRatio: number } | null;
}

// Resolved image object (after GROQ asset-> deref)
export interface SanityImage {
  _type: 'image';
  asset: SanityImageAssetMeta;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
}

// imageWithAlt after deref: { image: SanityImage, alt: LocaleString, caption? }
export interface ImageWithAlt {
  _type: 'imageWithAlt';
  image: SanityImage | null;
  alt: LocaleString | null;
  caption?: LocaleString | null;
}

// ──────────────────────────────────────────────────────────────
// Links / CTAs
// ──────────────────────────────────────────────────────────────

export type LinkKind = 'anchor' | 'internal' | 'external' | 'email' | 'tel';

export interface Link {
  _type: 'link';
  label: LocaleString;
  kind: LinkKind;
  anchor?: string;
  internalRef?: { slug: { current: string } } | null;
  href?: string;
  openInNewTab?: boolean;
}

export type CtaVariant = 'primary' | 'secondary' | 'ghost';

export interface Cta {
  _type: 'cta';
  link: Link;
  variant?: CtaVariant;
}

// ──────────────────────────────────────────────────────────────
// Map / contact
// ──────────────────────────────────────────────────────────────

export interface MapLocation {
  _type: 'mapLocation';
  address?: LocaleText | null;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsEmbedUrl?: string | null;
  directions?: LocaleText | null;
}

export interface OpeningPeriod {
  _type: 'openingPeriod';
  _key?: string;
  label: LocaleString;
  startDate?: string | null;
  endDate?: string | null;
}

// ──────────────────────────────────────────────────────────────
// Collection documents (referenced from sections)
// ──────────────────────────────────────────────────────────────

export type EquipmentId =
  | 'wifi' | 'kitchen' | 'kitchenette' | 'privateBathroom' | 'sharedBathroom'
  | 'terrace' | 'garden' | 'fireplace' | 'heating' | 'airConditioning'
  | 'tv' | 'washingMachine' | 'dishwasher' | 'parking' | 'linenProvided'
  | 'towelsProvided' | 'breakfastIncluded' | 'petsAllowed' | 'nonSmoking' | 'accessible';

export interface Accommodation {
  _id: string;
  _type: 'accommodation';
  name: LocaleString;
  slug?: { current: string };
  shortDescription?: LocaleText | null;
  body?: LocalePortableText | null;
  mainImage: ImageWithAlt | null;
  gallery?: ImageWithAlt[] | null;
  capacity?: number | null;
  bedrooms?: number | null;
  beds?: number | null;
  bathrooms?: number | null;
  surfaceM2?: number | null;
  equipments?: EquipmentId[] | null;
  featured?: boolean;
  order?: number;
}

export interface Testimonial {
  _id: string;
  _type: 'testimonial';
  authorName: string;
  origin?: LocaleString | null;
  rating?: number | null;
  body: LocaleText;
  date?: string | null;
  avatar?: SanityImage | null;
  source?: 'direct' | 'google' | 'airbnb' | 'booking' | 'other';
  published?: boolean;
  order?: number;
}

export type ActivityCategory =
  | 'compostelle' | 'randonnee' | 'patrimoine' | 'nature'
  | 'gastronomie' | 'famille' | 'sport' | 'autre';

export interface Activity {
  _id: string;
  _type: 'activity';
  name: LocaleString;
  slug?: { current: string };
  category: ActivityCategory;
  description: LocaleText;
  image: ImageWithAlt | null;
  distanceKm?: number | null;
  duration?: LocaleString | null;
  externalUrl?: string | null;
  featured?: boolean;
  order?: number;
}

export type PriceUnit = 'perNight' | 'perWeek' | 'perStay';

export interface PricingPeriod {
  _id: string;
  _type: 'pricingPeriod';
  name: LocaleString;
  startDate?: string | null;
  endDate?: string | null;
  pricePerNight?: number | null;
  priceUnit?: PriceUnit;
  currency?: 'EUR' | 'USD' | 'GBP';
  minNights?: number | null;
  accommodation?: { _id: string; name: LocaleString } | null;
  includes?: LocaleString[] | null;
  notes?: LocaleText | null;
  order?: number;
}

export interface SecondaryPage {
  _id: string;
  _type: 'page';
  title: LocaleString;
  slug: { current: string };
  heroImage?: ImageWithAlt | null;
  body: LocalePortableText;
  showInFooter?: boolean;
}

// ──────────────────────────────────────────────────────────────
// Home page sections (discriminated union via _type)
// ──────────────────────────────────────────────────────────────

interface SectionBase {
  _key: string;
  enabled: boolean;
  sectionId?: string;
  eyebrow?: LocaleString | null;
  title: LocaleString;
}

export interface LocationBadge {
  city?: LocaleString | null;
  region?: LocaleString | null;
  detailsLink?: Link | null;
}

export interface HeroSection extends Omit<SectionBase, 'title'> {
  _type: 'heroSection';
  title: LocaleText; // multiline allowed (overrides SectionBase.title)
  subtitle?: LocaleText | null;
  backgroundImage: ImageWithAlt | null;
  coquillageOverlay?: boolean;
  locationBadge?: LocationBadge | null;
  primaryCta?: Cta | null;
  secondaryCta?: Cta | null;
}

export interface PresentationSection extends SectionBase {
  _type: 'presentationSection';
  body?: LocalePortableText | null;
  image?: ImageWithAlt | null;            // main square image (top-right)
  wideImage?: ImageWithAlt | null;        // wide image below text (same width)
  secondaryImage?: ImageWithAlt | null;   // square image below main (right column)
  layout?: 'imageLeft' | 'imageRight' | 'imageTop'; // legacy, unused in new layout
}

export interface AccommodationsSection extends SectionBase {
  _type: 'accommodationsSection';
  intro?: LocaleText | null;
  accommodations: Accommodation[];
  layout?: 'grid' | 'alternating';
}

export interface GallerySection extends SectionBase {
  _type: 'gallerySection';
  intro?: LocaleText | null;
  images: ImageWithAlt[];
  layout?: 'grid' | 'masonry' | 'carousel';
}

export interface PricingSection extends SectionBase {
  _type: 'pricingSection';
  intro?: LocaleText | null;
  periods: PricingPeriod[];
  notes?: LocalePortableText | null;
}

export interface TestimonialsSection extends SectionBase {
  _type: 'testimonialsSection';
  intro?: LocaleText | null;
  testimonials: Testimonial[];
  displayMode?: 'carousel' | 'grid' | 'list';
}

export interface ActivitiesSection extends SectionBase {
  _type: 'activitiesSection';
  intro?: LocaleText | null;
  activities: Activity[];
  layout?: 'grid' | 'carousel';
}

export interface LocationSection extends SectionBase {
  _type: 'locationSection';
  intro?: LocaleText | null;
  map?: MapLocation | null;
  image?: ImageWithAlt | null;
}

export interface ContactSection extends SectionBase {
  _type: 'contactSection';
  intro?: LocaleText | null;
  showEmail?: boolean;
  showPhone?: boolean;
  airbnbCta?: Cta | null;
  additionalNotes?: LocaleText | null;
}

export type Section =
  | HeroSection
  | PresentationSection
  | AccommodationsSection
  | GallerySection
  | PricingSection
  | TestimonialsSection
  | ActivitiesSection
  | LocationSection
  | ContactSection;

// ──────────────────────────────────────────────────────────────
// Singletons
// ──────────────────────────────────────────────────────────────

export interface SeoSettings {
  _type: 'seo';
  title?: LocaleString | null;
  description?: LocaleText | null;
  image?: SanityImage | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
}

export interface Theme {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface SiteSettings {
  _id: 'siteSettings';
  _type: 'siteSettings';
  siteName: LocaleString;
  tagline?: LocaleString | null;
  logo?: SanityImage | null;
  coquillageIcon?: SanityImage | null;
  favicon?: SanityImage | null;
  email: string;
  phone?: string | null;
  address?: LocaleText | null;
  externalLinks?: {
    airbnb?: string | null;
    googleBusiness?: string | null;
    bookingCom?: string | null;
  } | null;
  theme?: Theme | null;
  socialImage?: SanityImage | null;
  mainNavigation?: Link[] | null;
  footerLinks?: Link[] | null;
  copyright?: LocaleString | null;
  openingPeriods?: OpeningPeriod[] | null;
  openingNotes?: LocaleText | null;
  defaultSeo?: SeoSettings | null;
  organizationSchema?: {
    legalName?: string;
    siret?: string;
    priceRange?: string;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
  defaultLocale: 'fr' | 'en';
  enabledLocales: string[];
  footerPages?: SecondaryPage[];
}

export interface HomePage {
  _id: 'homePage';
  _type: 'homePage';
  sections: Section[];
  seo?: SeoSettings | null;
}

// ──────────────────────────────────────────────────────────────
// Aggregate payload returned by homeService
// ──────────────────────────────────────────────────────────────

export interface HomePayload {
  siteSettings: SiteSettings | null;
  homePage: HomePage | null;
}
