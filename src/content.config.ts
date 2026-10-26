import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const isoDate = z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const visits = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/visits' }),
  schema: z.object({
    title: z.string(),
    date: isoDate,
    type: z.string(),
    location: z.string(),
    summary: z.string(),
    clinician: z.string().optional(),
  }),
});

const conditions = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/conditions' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['active', 'managed', 'historical', 'ruled-out']),
    diagnosed: isoDate.optional(),
    severity: z.string().optional(),
    summary: z.string(),
    order: z.number().default(99),
  }),
});

const imaging = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/imaging' }),
  schema: z.object({
    title: z.string(),
    date: isoDate,
    modality: z.string(),
    region: z.string(),
    reason: z.string(),
    outcome: z.string(),
    images: z
      .array(z.object({ src: z.string(), caption: z.string(), group: z.string() }))
      .default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['care', 'about', 'plan', 'seizures']),
    order: z.number().default(99),
  }),
});

export const collections = { visits, conditions, imaging, pages };
