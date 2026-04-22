import type { StructureResolver } from 'sanity/structure';
import {
  CogIcon,
  HomeIcon,
  StarIcon,
  PinIcon,
  TagIcon,
  DocumentsIcon,
} from '@sanity/icons';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Gîte chez Martin')
    .items([
      // Singletons
      S.listItem()
        .title('Paramètres du site')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Paramètres du site'),
        ),
      S.listItem()
        .title('Page d’accueil')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .title('Page d’accueil'),
        ),
      S.divider(),

      // Collections ordonnables (drag & drop sur le champ `order`)
      orderableDocumentListDeskItem({
        type: 'accommodation',
        title: 'Hébergements',
        icon: HomeIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'testimonial',
        title: 'Avis clients',
        icon: StarIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'activity',
        title: 'Activités & tourisme',
        icon: PinIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'pricingPeriod',
        title: 'Tarifs & saisons',
        icon: TagIcon,
        S,
        context,
      }),
      S.divider(),

      // Pages secondaires (mentions légales, etc.)
      S.listItem()
        .title('Pages secondaires')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('page').title('Pages secondaires')),
    ]);
