import { defineField, defineType } from 'sanity';

export const accommodationsSection = defineType({
  name: 'accommodationsSection',
  title: 'Section Hébergements',
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
      initialValue: 'hebergements',
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
      name: 'accommodations',
      title: 'Hébergements à afficher',
      description: 'Laisser vide pour afficher automatiquement tous les hébergements (ordre défini dans la liste).',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'accommodation' }],
        },
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Mise en page',
      type: 'string',
      options: {
        list: [
          { title: 'Grille', value: 'grid' },
          { title: 'Liste verticale alternée', value: 'alternating' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: { title: 'title.fr', enabled: 'enabled' },
    prepare({ title, enabled }) {
      return {
        title: title || 'Hébergements',
        subtitle: enabled ? '✓ Activée' : '✗ Désactivée',
      };
    },
  },
});
