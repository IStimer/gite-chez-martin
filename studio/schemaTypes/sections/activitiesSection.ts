import { defineField, defineType } from 'sanity';

export const activitiesSection = defineType({
  name: 'activitiesSection',
  title: 'Section Activités & tourisme',
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
      initialValue: 'activites',
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
      name: 'activities',
      title: 'Activités à afficher',
      description: 'Laisser vide pour afficher toutes les activités.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'activity' }],
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
          { title: 'Carrousel', value: 'carousel' },
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
        title: title || 'Activités & tourisme',
        subtitle: enabled ? '✓ Activée' : '✗ Désactivée',
      };
    },
  },
});
