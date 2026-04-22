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
      description: 'Utiliser des retours à la ligne pour répartir sur plusieurs lignes.',
      type: 'localeText',
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
      name: 'locationBadge',
      title: 'Carte de localisation (haut-droite)',
      description: 'Petite carte pill avec icône pin affichée en haut à droite du hero.',
      type: 'object',
      fields: [
        defineField({ name: 'city', title: 'Ville', type: 'localeString' }),
        defineField({ name: 'region', title: 'Région / pays', type: 'localeString' }),
        defineField({ name: 'detailsLink', title: 'Lien "Détails"', type: 'link' }),
      ],
      options: { collapsible: true, collapsed: false },
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
