import { defineField, defineType } from 'sanity';
import { PinIcon } from '@sanity/icons';

export const activity = defineType({
  name: 'activity',
  title: 'Activité / Tourisme',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: { name?: { fr?: string } }) => doc?.name?.fr ?? '',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Compostelle', value: 'compostelle' },
          { title: 'Randonnée', value: 'randonnee' },
          { title: 'Patrimoine', value: 'patrimoine' },
          { title: 'Nature', value: 'nature' },
          { title: 'Gastronomie', value: 'gastronomie' },
          { title: 'Famille', value: 'famille' },
          { title: 'Sport', value: 'sport' },
          { title: 'Autre', value: 'autre' },
        ],
      },
      initialValue: 'autre',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'distanceKm',
      title: 'Distance (km depuis le gîte)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'duration',
      title: 'Durée indicative',
      description: 'Ex. "1h de marche", "demi-journée".',
      type: 'localeString',
    }),
    defineField({
      name: 'externalUrl',
      title: 'Lien externe (site officiel, office de tourisme…)',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Mise en avant',
      type: 'boolean',
      initialValue: false,
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
      title: 'Distance (proche → loin)',
      name: 'distanceAsc',
      by: [{ field: 'distanceKm', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name.fr',
      subtitle: 'category',
      media: 'image.image',
      distance: 'distanceKm',
    },
    prepare({ title, subtitle, media, distance }) {
      const parts = [subtitle];
      if (typeof distance === 'number') parts.push(`${distance} km`);
      return {
        title: title || 'Activité',
        subtitle: parts.filter(Boolean).join(' • '),
        media,
      };
    },
  },
});
