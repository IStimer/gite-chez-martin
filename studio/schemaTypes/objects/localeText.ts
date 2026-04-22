import { defineField, defineType } from 'sanity';

export const localeText = defineType({
  name: 'localeText',
  title: 'Texte long localisé',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().warning('Le français est requis'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: { fr: 'fr', en: 'en' },
    prepare({ fr, en }) {
      const excerpt = (fr || en || '').slice(0, 80);
      return {
        title: excerpt || '—',
      };
    },
  },
});
