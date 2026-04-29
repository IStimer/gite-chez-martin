import { defineField, defineType } from 'sanity';
import { TagIcon } from '@sanity/icons';
import { orderRankField } from '@sanity/orderable-document-list';

export const pricingPeriod = defineType({
  name: 'pricingPeriod',
  title: 'Saison tarifaire',
  type: 'document',
  icon: TagIcon,
  fields: [
    orderRankField({ type: 'pricingPeriod' }),
    defineField({
      name: 'name',
      title: 'Nom',
      description: 'Ex. "Basse saison", "Haute saison", "Fêtes de fin d’année".',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Date de début',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'Date de fin',
      type: 'date',
    }),
    defineField({
      name: 'pricePerNight',
      title: 'Prix par nuit',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'priceUnit',
      title: 'Unité de prix',
      type: 'string',
      options: {
        list: [
          { title: 'par nuit', value: 'perNight' },
          { title: 'par semaine', value: 'perWeek' },
          { title: 'par séjour', value: 'perStay' },
        ],
        layout: 'radio',
      },
      initialValue: 'perNight',
    }),
    defineField({
      name: 'currency',
      title: 'Devise',
      type: 'string',
      options: {
        list: [
          { title: 'Euro (€)', value: 'EUR' },
          { title: 'Dollar US ($)', value: 'USD' },
          { title: 'Livre (£)', value: 'GBP' },
        ],
      },
      initialValue: 'EUR',
    }),
    defineField({
      name: 'minNights',
      title: 'Nombre de nuits minimum',
      type: 'number',
      validation: (Rule) => Rule.min(1),
      initialValue: 1,
    }),
    defineField({
      name: 'accommodation',
      title: 'Hébergement concerné (optionnel)',
      description: 'Laisser vide si le tarif s’applique au gîte entier / à tous les hébergements.',
      type: 'reference',
      to: [{ type: 'accommodation' }],
    }),
    defineField({
      name: 'includes',
      title: 'Inclus dans le tarif',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'notes',
      title: 'Notes complémentaires',
      type: 'localeText',
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Ordre personnalisé',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Date de début',
      name: 'startAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name.fr',
      price: 'pricePerNight',
      currency: 'currency',
      unit: 'priceUnit',
      start: 'startDate',
      end: 'endDate',
    },
    prepare({ title, price, currency, unit, start, end }) {
      const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€';
      const unitLabel = unit === 'perWeek' ? '/semaine' : unit === 'perStay' ? '/séjour' : '/nuit';
      const priceStr = price ? `${price}${currencySymbol}${unitLabel}` : '—';
      const rangeStr = start && end ? `${start} → ${end}` : '';
      return {
        title: title || 'Saison',
        subtitle: `${priceStr}${rangeStr ? ` • ${rangeStr}` : ''}`,
      };
    },
  },
});
