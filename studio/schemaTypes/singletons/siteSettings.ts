import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Identité', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'theme', title: 'Thème & visuels' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'opening', title: 'Ouverture' },
    { name: 'seo', title: 'SEO & référencement' },
    { name: 'i18n', title: 'Langues' },
  ],
  fields: [
    // IDENTITY
    defineField({
      name: 'siteName',
      title: 'Nom du site',
      type: 'localeString',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Accroche courte',
      description: 'Ex. "Gîte authentique sur le chemin de Compostelle".',
      type: 'localeString',
      group: 'identity',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: false },
      group: 'identity',
    }),
    defineField({
      name: 'coquillageIcon',
      title: 'Symbole coquillage',
      description: 'Icône coquillage Saint-Jacques utilisée dans la signalétique du site.',
      type: 'image',
      group: 'identity',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      description: 'Petite icône affichée dans l’onglet du navigateur. 512×512 recommandé.',
      type: 'image',
      group: 'identity',
    }),
    // CONTACT
    defineField({
      name: 'email',
      title: 'Email de contact',
      type: 'string',
      group: 'contact',
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email' })
          .error('Format email invalide')
          .required(),
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Adresse postale',
      type: 'localeText',
      group: 'contact',
    }),
    defineField({
      name: 'externalLinks',
      title: 'Liens externes',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'airbnb',
          title: 'Annonce Airbnb',
          type: 'url',
        }),
        defineField({
          name: 'googleBusiness',
          title: 'Fiche Google Business',
          type: 'url',
        }),
        defineField({
          name: 'bookingCom',
          title: 'Annonce Booking',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Page Facebook',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'googleReviews',
      title: 'Avis Google',
      description:
        'Pour récupérer les avis depuis Google. Demande aussi une clé API Maps (côté env : VITE_GOOGLE_PLACES_API_KEY).',
      type: 'object',
      group: 'contact',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'placeId',
          title: 'Google Place ID',
          description:
            'ID du lieu sur Google Maps. À récupérer via Google Place ID Finder.',
          type: 'string',
        }),
        defineField({
          name: 'merge',
          title: 'Fusionner avec les avis Sanity',
          description:
            'Si activé, les avis Google sont affichés après ceux gérés dans Sanity. Sinon seuls les avis Sanity sont affichés.',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    // THEME
    defineField({
      name: 'theme',
      title: 'Palette de couleurs',
      description: 'Valeurs au format hexadécimal (#RRGGBB).',
      type: 'object',
      group: 'theme',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'primaryColor',
          title: 'Couleur principale (vert foncé)',
          type: 'string',
          initialValue: '#1F3A2E',
          validation: (Rule) =>
            Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Attendu : #RRGGBB'),
        }),
        defineField({
          name: 'secondaryColor',
          title: 'Couleur secondaire (beige)',
          type: 'string',
          initialValue: '#E8DEC5',
          validation: (Rule) =>
            Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Attendu : #RRGGBB'),
        }),
        defineField({
          name: 'accentColor',
          title: 'Couleur d’accent (doré)',
          type: 'string',
          initialValue: '#C9A45B',
          validation: (Rule) =>
            Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Attendu : #RRGGBB'),
        }),
        defineField({
          name: 'backgroundColor',
          title: 'Couleur de fond (ivoire)',
          type: 'string',
          initialValue: '#FBF8F1',
          validation: (Rule) =>
            Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Attendu : #RRGGBB'),
        }),
        defineField({
          name: 'textColor',
          title: 'Couleur du texte (encre)',
          type: 'string',
          initialValue: '#1A1A1A',
          validation: (Rule) =>
            Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Attendu : #RRGGBB'),
        }),
      ],
    }),
    defineField({
      name: 'socialImage',
      title: 'Image de partage par défaut',
      description: 'Affichée lors du partage du site (Open Graph). 1200×630 recommandé.',
      type: 'image',
      options: { hotspot: true },
      group: 'theme',
    }),
    // NAVIGATION
    defineField({
      name: 'mainNavigation',
      title: 'Menu principal',
      description: 'Liens affichés dans la barre de navigation (typiquement des ancres vers les sections de la home).',
      type: 'array',
      of: [{ type: 'link' }],
      group: 'navigation',
    }),
    defineField({
      name: 'footerLinks',
      title: 'Liens du pied de page',
      type: 'array',
      of: [{ type: 'link' }],
      group: 'navigation',
    }),
    defineField({
      name: 'copyright',
      title: 'Mention de copyright',
      description: 'Ex. "© 2026 Gîte chez Martin". Laisser vide pour masquer.',
      type: 'localeString',
      group: 'navigation',
    }),
    // OPENING
    defineField({
      name: 'openingPeriods',
      title: 'Périodes d’ouverture',
      type: 'array',
      of: [{ type: 'openingPeriod' }],
      group: 'opening',
    }),
    defineField({
      name: 'openingNotes',
      title: 'Notes sur les disponibilités',
      type: 'localeText',
      group: 'opening',
    }),
    // SEO
    defineField({
      name: 'defaultSeo',
      title: 'SEO par défaut',
      description: 'Utilisé quand une page n’a pas de SEO spécifique.',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'organizationSchema',
      title: 'Données d’organisation (JSON-LD)',
      description: 'Pour les rich results Google.',
      type: 'object',
      group: 'seo',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'legalName', title: 'Raison sociale', type: 'string' }),
        defineField({ name: 'siret', title: 'SIRET', type: 'string' }),
        defineField({
          name: 'priceRange',
          title: 'Gamme de prix',
          description: 'Ex. "€€" pour classification Google.',
          type: 'string',
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
      ],
    }),
    // I18N
    defineField({
      name: 'defaultLocale',
      title: 'Langue par défaut',
      type: 'string',
      options: {
        list: [
          { title: 'Français', value: 'fr' },
          { title: 'English', value: 'en' },
        ],
        layout: 'radio',
      },
      initialValue: 'fr',
      group: 'i18n',
    }),
    defineField({
      name: 'enabledLocales',
      title: 'Langues activées',
      description: 'Cocher les langues à afficher sur le site public.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Français', value: 'fr' },
          { title: 'English', value: 'en' },
        ],
      },
      initialValue: ['fr'],
      group: 'i18n',
    }),
  ],
  preview: {
    select: { title: 'siteName.fr', media: 'logo' },
    prepare({ title, media }) {
      return {
        title: title || 'Paramètres du site',
        subtitle: 'Singleton',
        media,
      };
    },
  },
});
