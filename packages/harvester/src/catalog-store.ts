import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { sourceCatalogSchema, type SourceCatalog } from '@case-forge/contracts';

export function readCatalog(path: string): SourceCatalog | null {
  if (!existsSync(path)) return null;
  const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  return sourceCatalogSchema.parse(raw);
}

export function writeCatalog(path: string, catalog: SourceCatalog): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
}

export function defaultCatalogPath(root = process.cwd()): string {
  return resolve(root, 'data/catalog/europe_pmc_oa.json');
}

export function mergeCatalogDocuments(
  existing: SourceCatalog | null,
  incoming: SourceCatalog,
): SourceCatalog {
  const byKey = new Map<string, (typeof incoming.documents)[number]>();
  for (const doc of existing?.documents ?? []) {
    byKey.set(doc.pmcid ?? doc.pmid ?? doc.doi ?? doc.url, doc);
  }
  for (const doc of incoming.documents) {
    byKey.set(doc.pmcid ?? doc.pmid ?? doc.doi ?? doc.url, doc);
  }
  return {
    ...incoming,
    documents: [...byKey.values()],
  };
}
