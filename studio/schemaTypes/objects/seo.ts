import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Titre SEO',
      description: 'Affiché dans l’onglet du navigateur et sur Google. ~60 caractères idéal.',
      type: 'localeString',
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      description: 'Résumé affiché sous le titre sur Google. ~155 caractères idéal.',
      type: 'localeText',
    }),
    defineField({
      name: 'image',
      title: 'Image de partage (Open Graph)',
      description: 'Image affichée lors du partage sur réseaux sociaux / messageries. 1200×630 recommandé.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'URL canonique',
      type: 'url',
    }),
    defineField({
      name: 'noIndex',
      title: 'Masquer aux moteurs de recherche',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
