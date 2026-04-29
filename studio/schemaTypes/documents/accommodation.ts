import { defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';
import { orderRankField } from '@sanity/orderable-document-list';

const EQUIPMENT_OPTIONS = [
  { title: 'Wifi', value: 'wifi' },
  { title: 'Cuisine équipée', value: 'kitchen' },
  { title: 'Cuisinette / kitchenette', value: 'kitchenette' },
  { title: 'Salle de bain privative', value: 'privateBathroom' },
  { title: 'Salle de bain partagée', value: 'sharedBathroom' },
  { title: 'Terrasse', value: 'terrace' },
  { title: 'Jardin', value: 'garden' },
  { title: 'Cheminée / poêle', value: 'fireplace' },
  { title: 'Chauffage', value: 'heating' },
  { title: 'Climatisation', value: 'airConditioning' },
  { title: 'Télévision', value: 'tv' },
  { title: 'Lave-linge', value: 'washingMachine' },
  { title: 'Lave-vaisselle', value: 'dishwasher' },
  { title: 'Parking privé', value: 'parking' },
  { title: 'Linge de lit fourni', value: 'linenProvided' },
  { title: 'Linge de toilette fourni', value: 'towelsProvided' },
  { title: 'Petit-déjeuner inclus', value: 'breakfastIncluded' },
  { title: 'Animaux acceptés', value: 'petsAllowed' },
  { title: 'Non-fumeur', value: 'nonSmoking' },
  { title: 'Accès PMR', value: 'accessible' },
];

export const accommodation = defineType({
  name: 'accommodation',
  title: 'Hébergement',
  type: 'document',
  icon: HomeIcon,
  fieldsets: [
    { name: 'basics', title: 'Informations principales' },
    { name: 'details', title: 'Caractéristiques' },
    { name: 'media', title: 'Médias' },
    { name: 'admin', title: 'Administration', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    orderRankField({ type: 'accommodation' }),
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'localeString',
      fieldset: 'basics',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      fieldset: 'basics',
      options: {
        source: (doc: { name?: { fr?: string } }) => doc?.name?.fr ?? '',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Description courte (carte)',
      description: 'Affichée dans les aperçus. ~160 caractères.',
      type: 'localeText',
      fieldset: 'basics',
    }),
    defineField({
      name: 'body',
      title: 'Description détaillée',
      type: 'localePortableText',
      fieldset: 'basics',
    }),
    defineField({
      name: 'mainImage',
      title: 'Photo principale',
      type: 'imageWithAlt',
      fieldset: 'media',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie (photos supplémentaires)',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      fieldset: 'media',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacité (personnes)',
      type: 'number',
      fieldset: 'details',
      validation: (Rule) => Rule.min(1).max(20),
    }),
    defineField({
      name: 'bedrooms',
      title: 'Nombre de chambres',
      type: 'number',
      fieldset: 'details',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'beds',
      title: 'Nombre de lits',
      type: 'number',
      fieldset: 'details',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Nombre de salles de bain',
      type: 'number',
      fieldset: 'details',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'surfaceM2',
      title: 'Surface (m²)',
      type: 'number',
      fieldset: 'details',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'equipments',
      title: 'Équipements',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: EQUIPMENT_OPTIONS },
      fieldset: 'details',
    }),
    defineField({
      name: 'featured',
      title: 'Mis en avant',
      description: 'Afficher en premier dans les listes et badges "Coup de cœur".',
      type: 'boolean',
      fieldset: 'admin',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      description: 'Laissez vide pour trier par nom. Sinon plus petit = en premier.',
      type: 'number',
      fieldset: 'admin',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      fieldset: 'admin',
    }),
  ],
  orderings: [
    {
      title: 'Ordre personnalisé',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Nom (A→Z)',
      name: 'nameAsc',
      by: [{ field: 'name.fr', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name.fr',
      subtitle: 'shortDescription.fr',
      media: 'mainImage.image',
      featured: 'featured',
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title || 'Sans nom'}`,
        subtitle: (subtitle || '').slice(0, 80),
        media,
      };
    },
  },
});
