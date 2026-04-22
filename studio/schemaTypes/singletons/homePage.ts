import { defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';

export const homePage = defineType({
  name: 'homePage',
  title: 'Page d’accueil',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections',
      description:
        'Glisser-déposer pour réordonner. Chaque section a un interrupteur "Afficher" pour la masquer sans la supprimer.',
      type: 'array',
      of: [
        { type: 'heroSection' },
        { type: 'presentationSection' },
        { type: 'accommodationsSection' },
        { type: 'gallerySection' },
        { type: 'pricingSection' },
        { type: 'testimonialsSection' },
        { type: 'activitiesSection' },
        { type: 'locationSection' },
        { type: 'contactSection' },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      description: 'Laisser vide pour utiliser le SEO par défaut des Paramètres du site.',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Page d’accueil',
        subtitle: 'Singleton',
      };
    },
  },
});
