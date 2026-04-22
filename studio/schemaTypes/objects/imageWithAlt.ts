import { defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Fichier',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette', 'dimensions', 'blurhash'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Texte alternatif (accessibilité + SEO)',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Légende (optionnelle)',
      type: 'localeString',
    }),
  ],
  preview: {
    select: { media: 'image', title: 'alt.fr', subtitle: 'caption.fr' },
  },
});
