import { defineField, defineType } from 'sanity';

export const cta = defineType({
  name: 'cta',
  title: 'Bouton d’action',
  type: 'object',
  fields: [
    defineField({
      name: 'link',
      title: 'Lien',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Principal (plein)', value: 'primary' },
          { title: 'Secondaire (contour)', value: 'secondary' },
          { title: 'Discret (texte)', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'link.label.fr', subtitle: 'variant' },
  },
});
