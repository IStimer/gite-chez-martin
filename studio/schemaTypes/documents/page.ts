import { defineField, defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';

export const page = defineType({
  name: 'page',
  title: 'Page secondaire',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: { title?: { fr?: string } }) => doc?.title?.fr ?? '',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Image d’en-tête (optionnelle)',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'localePortableText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showInFooter',
      title: 'Afficher dans le pied de page',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title.fr', slug: 'slug.current', media: 'heroImage.image' },
    prepare({ title, slug, media }) {
      return {
        title: title || 'Sans titre',
        subtitle: slug ? `/${slug}` : undefined,
        media,
      };
    },
  },
});
