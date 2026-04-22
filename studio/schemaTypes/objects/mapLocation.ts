import { defineField, defineType } from 'sanity';

export const mapLocation = defineType({
  name: 'mapLocation',
  title: 'Localisation',
  type: 'object',
  fields: [
    defineField({
      name: 'address',
      title: 'Adresse postale',
      type: 'localeText',
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      validation: (Rule) => Rule.min(-180).max(180),
    }),
    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'URL d’intégration Google Maps',
      description: 'L’URL "src" récupérée depuis Google Maps → Partager → Intégrer une carte.',
      type: 'url',
    }),
    defineField({
      name: 'directions',
      title: 'Indications d’accès',
      description: 'Précisions (route, gare la plus proche, parking, etc.).',
      type: 'localeText',
    }),
  ],
});
