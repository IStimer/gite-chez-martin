import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, SINGLETON_TYPES } from './schemaTypes';
import { structure } from './structure';

export default defineConfig({
  name: 'gite-chez-martin',
  title: 'Gîte chez Martin',

  projectId: 'v4vmlsv9',
  dataset: 'production',

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    // Empêche la création des singletons depuis la liste "+"
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    // Masque "Create new" pour les singletons
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => !SINGLETON_TYPES.has(item.templateId));
      }
      return prev;
    },
    // Retire Delete / Duplicate sur les singletons
    actions: (prev, { schemaType }) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return prev.filter(
          ({ action }) => !['delete', 'duplicate', 'unpublish'].includes(action ?? ''),
        );
      }
      return prev;
    },
  },
});
