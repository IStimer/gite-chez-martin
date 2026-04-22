import { Fragment, memo } from 'react';
import type { Section } from '../../types/content';
import HeroSection from './HeroSection';
import PresentationSection from './PresentationSection';
import AccommodationsSection from './AccommodationsSection';
import GallerySection from './GallerySection';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import ActivitiesSection from './ActivitiesSection';
import LocationSection from './LocationSection';
import ContactSection from './ContactSection';

interface Props {
  sections: Section[];
}

const renderOne = (section: Section) => {
  if (!section.enabled) return null;
  switch (section._type) {
    case 'heroSection': return <HeroSection key={section._key} data={section} />;
    case 'presentationSection': return <PresentationSection key={section._key} data={section} />;
    case 'accommodationsSection': return <AccommodationsSection key={section._key} data={section} />;
    case 'gallerySection': return <GallerySection key={section._key} data={section} />;
    case 'pricingSection': return <PricingSection key={section._key} data={section} />;
    case 'testimonialsSection': return <TestimonialsSection key={section._key} data={section} />;
    case 'activitiesSection': return <ActivitiesSection key={section._key} data={section} />;
    case 'locationSection': return <LocationSection key={section._key} data={section} />;
    case 'contactSection': return <ContactSection key={section._key} data={section} />;
    default: return null;
  }
};

const SectionRenderer = memo(({ sections }: Props) => (
  <Fragment>{sections.map(renderOne)}</Fragment>
));

SectionRenderer.displayName = 'SectionRenderer';
export default SectionRenderer;
