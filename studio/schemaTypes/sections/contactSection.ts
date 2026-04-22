import { defineField, defineType } from 'sanity';

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Section Contact',
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
      initialValue: 'contact',
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
      name: 'intro',
      title: 'Introduction',
      type: 'localeText',
    }),
    defineField({
      name: 'showEmail',
      title: 'Afficher l’email',
      description: 'Email pris dans Paramètres du site.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showPhone',
      title: 'Afficher le téléphone',
      description: 'Téléphone pris dans Paramètres du site.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'airbnbCta',
      title: 'Lien Airbnb',
      description: 'Bouton optionnel vers l’annonce Airbnb. URL prise dans Paramètres du site si non renseignée ici.',
      type: 'cta',
    }),
    defineField({
      name: 'additionalNotes',
      title: 'Notes complémentaires',
      description: 'Ex. horaires de réponse, langues parlées, délais.',
      type: 'localeText',
    }),
  ],
  preview: {
    select: { title: 'title.fr', enabled: 'enabled' },
    prepare({ title, enabled }) {
      return {
        title: title || 'Contact',
        subtitle: enabled ? '✓ Activée' : '✗ Désactivée',
      };
    },
  },
});
