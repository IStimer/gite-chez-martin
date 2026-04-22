import { defineField, defineType } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Texte localisé',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Le français est requis'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
    }),
  ],
  preview: {
    select: { fr: 'fr', en: 'en' },
    prepare({ fr, en }) {
      return {
        title: fr || en || '—',
        subtitle: en ? `EN: ${en}` : undefined,
      };
    },
  },
});
