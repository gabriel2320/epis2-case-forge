import { z } from 'zod';
import { sourceDocumentSchema, specialtySchema } from './schemas.js';

/** Documento indexado con trazabilidad de harvest (CASE-FORGE-01). */
export const indexedSourceDocumentSchema = sourceDocumentSchema.extend({
  sourceId: z.string().min(1),
  pmcid: z.string().optional(),
  pmid: z.string().optional(),
  searchQuery: z.string().min(1),
  isOpenAccess: z.boolean(),
  inPmc: z.boolean(),
  authorString: z.string().optional(),
});

export type IndexedSourceDocument = z.infer<typeof indexedSourceDocumentSchema>;

export const sourceCatalogSchema = z.object({
  version: z.literal('0.1.0'),
  sourceId: z.string().min(1),
  updatedAt: z.string().datetime(),
  harvestRunId: z.string().uuid(),
  queries: z.array(
    z.object({
      query: z.string(),
      specialties: z.array(specialtySchema),
      hitCount: z.number().int().nonnegative(),
    }),
  ),
  documents: z.array(indexedSourceDocumentSchema),
});

export type SourceCatalog = z.infer<typeof sourceCatalogSchema>;
