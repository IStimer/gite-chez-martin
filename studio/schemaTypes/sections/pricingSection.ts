import { defineField, defineType } from 'sanity';

export const pricingSection = defineType({
  name: 'pricingSection',
  title: 'Section Tarifs',
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
      initialValue: 'tarifs',
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
      name: 'periods',
      title: 'Saisons tarifaires',
      description: 'Laisser vide pour afficher automatiquement toutes les saisons.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'pricingPeriod' }],
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes / conditions',
      description: 'Mentions sur la taxe de séjour, caution, arrhes, etc.',
      type: 'localePortableText',
    }),
    defineField({
      name: 'sideImage',
      title: 'Image décorative (côté du panneau)',
      description: 'Paysage affiché à gauche du panneau tarifaire.',
      type: 'imageWithAlt',
    }),
  ],
  preview: {
    select: { title: 'title.fr', enabled: 'enabled' },
    prepare({ title, enabled }) {
      return {
        title: title || 'Tarifs',
        subtitle: enabled ? '✓ Activée' : '✗ Désactivée',
      };
    },
  },
});
