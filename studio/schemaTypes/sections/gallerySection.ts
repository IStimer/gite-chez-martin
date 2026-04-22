import { defineField, defineType } from 'sanity';

export const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Section Galerie',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Afficher cette section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sectionId',
      title: 'Identifiant d’ancre',
      type: 'string',
      initialValue: 'galerie',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Surtitre',
      type: 'localeString',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'localeText',
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'layout',
      title: 'Mise en page',
      type: 'string',
      options: {
        list: [
          { title: 'Grille régulière', value: 'grid' },
          { title: 'Mosaïque masonry', value: 'masonry' },
          { title: 'Carrousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      initialValue: 'masonry',
    }),
  ],
  preview: {
    select: {
      title: 'title.fr',
      enabled: 'enabled',
      media: 'images.0.image',
      count: 'images',
    },
    prepare({ title, enabled, media, count }) {
      const n = Array.isArray(count) ? count.length : 0;
      return {
        title: title || 'Galerie',
        subtitle: `${enabled ? '✓ Activée' : '✗ Désactivée'} • ${n} photo${n > 1 ? 's' : ''}`,
        media,
      };
    },
  },
});
