// Objects réutilisables
import { localeString } from './objects/localeString';
import { localeText } from './objects/localeText';
import { localePortableText } from './objects/localePortableText';
import { imageWithAlt } from './objects/imageWithAlt';
import { seo } from './objects/seo';
import { link } from './objects/link';
import { cta } from './objects/cta';
import { openingPeriod } from './objects/openingPeriod';
import { mapLocation } from './objects/mapLocation';

// Sections de la page d'accueil
import { heroSection } from './sections/heroSection';
import { presentationSection } from './sections/presentationSection';
import { accommodationsSection } from './sections/accommodationsSection';
import { gallerySection } from './sections/gallerySection';
import { pricingSection } from './sections/pricingSection';
import { testimonialsSection } from './sections/testimonialsSection';
import { activitiesSection } from './sections/activitiesSection';
import { locationSection } from './sections/locationSection';
import { contactSection } from './sections/contactSection';

// Singletons
import { siteSettings } from './singletons/siteSettings';
import { homePage } from './singletons/homePage';

// Documents collections
import { accommodation } from './documents/accommodation';
import { testimonial } from './documents/testimonial';
import { activity } from './documents/activity';
import { pricingPeriod } from './documents/pricingPeriod';
import { page } from './documents/page';

export const schemaTypes = [
  // Objects
  localeString,
  localeText,
  localePortableText,
  imageWithAlt,
  seo,
  link,
  cta,
  openingPeriod,
  mapLocation,
  // Sections
  heroSection,
  presentationSection,
  accommodationsSection,
  gallerySection,
  pricingSection,
  testimonialsSection,
  activitiesSection,
  locationSection,
  contactSection,
  // Singletons
  siteSettings,
  homePage,
  // Documents
  accommodation,
  testimonial,
  activity,
  pricingPeriod,
  page,
];

export const SINGLETON_TYPES = new Set(['siteSettings', 'homePage']);
export const SINGLETON_IDS: Record<string, string> = {
  siteSettings: 'siteSettings',
  homePage: 'homePage',
};
