import { defineArrayMember, defineField, defineType } from 'sanity';

const blockContent = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'H2', value: 'h2' },
      { title: 'H3', value: 'h3' },
      { title: 'H4', value: 'h4' },
      { title: 'Citation', value: 'blockquote' },
    ],
    lists: [
      { title: 'Puces', value: 'bullet' },
      { title: 'Numéroté', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Gras', value: 'strong' },
        { title: 'Italique', value: 'em' },
        { title: 'Souligné', value: 'underline' },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Lien',
          fields: [
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                  allowRelative: true,
                }),
            }),
            defineField({
              name: 'openInNewTab',
              type: 'boolean',
              title: 'Ouvrir dans un nouvel onglet',
              initialValue: false,
            }),
          ],
        },
      ],
    },
  }),
];

export const localePortableText = defineType({
  name: 'localePortableText',
  title: 'Contenu riche localisé',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: blockContent,
      validation: (Rule) => Rule.required().min(1).warning('Le français est requis'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: blockContent,
    }),
  ],
});
