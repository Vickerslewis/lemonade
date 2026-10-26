import { defineConfig } from 'astro/config';
import remarkCallouts from './src/lib/remark-callouts.mjs';
import remarkBaseLinks from './src/lib/remark-base-links.mjs';

const base = process.env.SITE_BASE ?? '/lemonade';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://vickerslewis.github.io',
  base,
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkCallouts, [remarkBaseLinks, { base }]],
  },
});
