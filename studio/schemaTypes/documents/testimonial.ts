import { defineField, defineType } from 'sanity';
import { StarIcon } from '@sanity/icons';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Avis client',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'authorName',
      title: 'Nom de l’auteur',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'origin',
      title: 'Origine (ville, pays)',
      type: 'localeString',
    }),
    defineField({
      name: 'rating',
      title: 'Note (sur 5)',
      type: 'number',
      options: {
        list: [1, 2, 3, 4, 5].map((n) => ({ title: '★'.repeat(n) + '☆'.repeat(5 - n), value: n })),
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'body',
      title: 'Témoignage',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date du séjour',
      type: 'date',
    }),
    defineField({
      name: 'avatar',
      title: 'Photo (optionnelle)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Direct (client)', value: 'direct' },
          { title: 'Google', value: 'google' },
          { title: 'Airbnb', value: 'airbnb' },
          { title: 'Booking', value: 'booking' },
          { title: 'Autre', value: 'other' },
        ],
      },
      initialValue: 'direct',
    }),
    defineField({
      name: 'published',
      title: 'Publié',
      description: 'Décoché = n’apparaît pas sur le site.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Ordre personnalisé',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Date (récent → ancien)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'body.fr',
      media: 'avatar',
      rating: 'rating',
      published: 'published',
    },
    prepare({ title, subtitle, media, rating, published }) {
      const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '';
      return {
        title: `${published ? '' : '🚫 '}${title || 'Anonyme'} • ${stars}`,
        subtitle: (subtitle || '').slice(0, 80),
        media,
      };
    },
  },
});
