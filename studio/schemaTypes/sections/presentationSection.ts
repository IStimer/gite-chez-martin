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
      title: 'Image principale (carrée, haut-droite)',
      description: 'Affichée à droite du bloc de texte.',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'wideImage',
      title: 'Image large (en dessous du texte)',
      description: 'Affichée sous le texte, même largeur que la colonne texte.',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Image secondaire (carrée, bas-droite)',
      description: 'Affichée sous l’image principale, même largeur que celle-ci.',
      type: 'imageWithAlt',
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
