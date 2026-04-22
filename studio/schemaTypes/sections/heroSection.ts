import { defineField, defineType } from 'sanity';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Section Hero (bannière)',
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
      description: 'Pour navigation interne. Ex. "accueil".',
      type: 'string',
      initialValue: 'accueil',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Surtitre',
      description: 'Petit texte au-dessus du titre principal. Ex. "Gîte sur le chemin de Compostelle".',
      type: 'localeString',
    }),
    defineField({
      name: 'title',
      title: 'Titre principal',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre / accroche',
      type: 'localeText',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Image de fond',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coquillageOverlay',
      title: 'Afficher le symbole coquillage en filigrane',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'primaryCta',
      title: 'Bouton principal',
      type: 'cta',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Bouton secondaire',
      type: 'cta',
    }),
  ],
  preview: {
    select: { title: 'title.fr', media: 'backgroundImage.image', enabled: 'enabled' },
    prepare({ title, media, enabled }) {
      return {
        title: title || 'Hero',
        subtitle: enabled ? '✓ Activée' : '✗ Désactivée',
        media,
      };
    },
  },
});
