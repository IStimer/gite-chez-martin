import { defineField, defineType } from 'sanity';

export const openingPeriod = defineType({
  name: 'openingPeriod',
  title: 'Période d’ouverture',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      description: 'Ex. "Saison 2026", "Ouvert toute l’année".',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Date de début',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'Date de fin',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'label.fr', start: 'startDate', end: 'endDate' },
    prepare({ title, start, end }) {
      const range = start && end ? ` • ${start} → ${end}` : '';
      return { title: title || 'Période', subtitle: range };
    },
  },
});
