import { defineField, defineType } from 'sanity';

export const locationSection = defineType({
  name: 'locationSection',
  title: 'Section Localisation & accès',
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
      initialValue: 'acces',
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
      name: 'map',
      title: 'Carte & indications',
      type: 'mapLocation',
    }),
    defineField({
      name: 'image',
      title: 'Image d’illustration (optionnelle)',
      description: 'Ex. photo d’un panneau ou d’un paysage repère.',
      type: 'imageWithAlt',
    }),
  ],
  preview: {
    select: { title: 'title.fr', enabled: 'enabled', media: 'image.image' },
    prepare({ title, enabled, media }) {
      return {
        title: title || 'Localisation & accès',
        subtitle: enabled ? '✓ Activée' : '✗ Désactivée',
        media,
      };
    },
  },
});
