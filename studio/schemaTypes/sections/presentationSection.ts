import { defineField, defineType } from 'sanity';

export const presentationSection = defineType({
  name: 'presentationSection',
  title: 'Section Présentation',
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
      initialValue: 'presentation',
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
      name: 'body',
      title: 'Contenu (ambiance, histoire, description)',
      type: 'localePortableText',
    }),
    defineField({
      name: 'image',
      title: 'Image d’illustration',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'layout',
      title: 'Disposition',
      type: 'string',
      options: {
        list: [
          { title: 'Image à gauche, texte à droite', value: 'imageLeft' },
          { title: 'Image à droite, texte à gauche', value: 'imageRight' },
          { title: 'Image au-dessus, texte en dessous', value: 'imageTop' },
        ],
        layout: 'radio',
      },
      initialValue: 'imageRight',
    }),
  ],
  preview: {
    select: { title: 'title.fr', media: 'image.image', enabled: 'enabled' },
    prepare({ title, media, enabled }) {
      return {
        title: title || 'Présentation',
        subtitle: enabled ? '✓ Activée' : '✗ Désactivée',
        media,
      };
    },
  },
});
