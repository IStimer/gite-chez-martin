import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'v4vmlsv9',
    dataset: 'production',
  },
  server: {
    port: 3333,
  },
});
