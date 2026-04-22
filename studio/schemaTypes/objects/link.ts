import { defineField, defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Lien',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Type de lien',
      type: 'string',
      options: {
        list: [
          { title: 'Ancre (section de la page)', value: 'anchor' },
          { title: 'Page interne', value: 'internal' },
          { title: 'URL externe', value: 'external' },
          { title: 'Email', value: 'email' },
          { title: 'Téléphone', value: 'tel' },
        ],
        layout: 'radio',
      },
      initialValue: 'anchor',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'anchor',
      title: 'Identifiant d’ancre',
      description: 'Ex. "hero", "hebergements", "contact". Correspond à l’ID d’une section.',
      type: 'string',
      hidden: ({ parent }) => parent?.kind !== 'anchor',
    }),
    defineField({
      name: 'internalRef',
      title: 'Page interne',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.kind !== 'internal',
    }),
    defineField({
      name: 'href',
      title: 'URL / email / numéro',
      description: 'URL complète, adresse email, ou numéro de téléphone selon le type.',
      type: 'string',
      hidden: ({ parent }) => !['external', 'email', 'tel'].includes(parent?.kind),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Ouvrir dans un nouvel onglet',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.kind !== 'external',
    }),
  ],
  preview: {
    select: { title: 'label.fr', subtitle: 'kind' },
  },
});
