import { defineField, defineType } from 'sanity';

export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Section Avis clients',
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
      initialValue: 'avis',
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
      name: 'testimonials',
      title: 'Avis à afficher',
      description: 'Laisser vide pour afficher tous les avis publiés.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'testimonial' }],
        },
      ],
    }),
    defineField({
      name: 'displayMode',
      title: 'Mode d’affichage',
      type: 'string',
      options: {
        list: [
          { title: 'Carrousel', value: 'carousel' },
          { title: 'Grille', value: 'grid' },
          { title: 'Liste verticale', value: 'list' },
        ],
        layout: 'radio',
      },
      initialValue: 'carousel',
    }),
  ],
  preview: {
    select: { title: 'title.fr', enabled: 'enabled' },
    prepare({ title, enabled }) {
      return {
        title: title || 'Avis clients',
        subtitle: enabled ? '✓ Activée' : '✗ Désactivée',
      };
    },
  },
});
