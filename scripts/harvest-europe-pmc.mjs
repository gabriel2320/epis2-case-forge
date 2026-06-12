#!/usr/bin/env node
/**
 * CASE-FORGE-01 — Harvest Europe PMC Open Access case reports.
 *
 * Uso: npm run harvest:europe-pmc
 * Env: CASE_FORGE_HARVEST_MIN=50  CASE_FORGE_HARVEST_MAX_PER_QUERY=40
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  EuropePmcClient,
  defaultCatalogPath,
  mergeCatalogDocuments,
  readCatalog,
  writeCatalog,
} from '@case-forge/harvester';

const MIN_DOCUMENTS = Number(process.env.CASE_FORGE_HARVEST_MIN ?? 50);
const MAX_PER_QUERY = Number(process.env.CASE_FORGE_HARVEST_MAX_PER_QUERY ?? 40);

function loadRegistry() {
  const path = resolve(process.cwd(), 'config/source_registry.yaml');
  return parseYaml(readFileSync(path, 'utf8'));
}

async function main() {
  const registry = loadRegistry();
  const source = registry.sources.find((s) => s.id === 'europe_pmc_oa' && s.enabled !== false);
  if (!source?.search_templates?.length) {
    throw new Error('europe_pmc_oa no configurado en source_registry.yaml');
  }

  const client = new EuropePmcClient({
    userAgent: registry.defaults?.user_agent,
    delayMs: 250,
  });

  const harvestedAt = new Date().toISOString();
  const harvestRunId = crypto.randomUUID();
  const queryStats = [];
  const allDocs = [];

  console.log(`EPIS2 Case Forge — harvest Europe PMC (objetivo ≥ ${MIN_DOCUMENTS} docs)\n`);

  for (const template of source.search_templates) {
    console.log(`▶ ${template.query}`);
    const result = await client.harvestQuery(
      source.id,
      {
        query: template.query,
        specialties: template.specialties,
      },
      { maxResults: MAX_PER_QUERY, harvestedAt },
    );
    queryStats.push({
      query: result.query,
      specialties: result.specialties,
      hitCount: result.hitCount,
    });
    allDocs.push(...result.documents);
    console.log(
      `  hitCount=${result.hitCount} indexed=${result.documents.length} (acumulado=${allDocs.length})`,
    );
    if (allDocs.length >= MIN_DOCUMENTS) break;
  }

  const catalogPath = defaultCatalogPath();
  const existing = readCatalog(catalogPath);
  const merged = mergeCatalogDocuments(existing, {
    version: '0.1.0',
    sourceId: source.id,
    updatedAt: harvestedAt,
    harvestRunId,
    queries: queryStats,
    documents: allDocs,
  });

  writeCatalog(catalogPath, merged);

  const bySpecialty = countBy(merged.documents, (d) => d.specialty);
  console.log(`\n✓ Catálogo: ${catalogPath}`);
  console.log(`  Documentos únicos: ${merged.documents.length}`);
  console.log(`  Por especialidad: ${JSON.stringify(bySpecialty)}`);

  if (merged.documents.length < MIN_DOCUMENTS) {
    console.warn(
      `\n⚠ Objetivo CASE-FORGE-01: ≥ ${MIN_DOCUMENTS} (actual: ${merged.documents.length})`,
    );
    process.exitCode = 1;
  }
}

function countBy(items, keyFn) {
  const out = {};
  for (const item of items) {
    const k = keyFn(item);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
