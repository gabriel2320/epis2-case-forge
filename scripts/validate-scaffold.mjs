#!/usr/bin/env node
/**
 * CASE-FORGE-00 — valida que el scaffold mínimo existe.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'docs/PRODUCT_CANON.md',
  'docs/SOURCE_POLICY.md',
  'docs/EPIS2_EXPORT_CONTRACT.md',
  'docs/ROADMAP.md',
  'config/source_registry.yaml',
  'packages/contracts/src/schemas.ts',
  'packages/contracts/src/demo-codes.ts',
  'packages/harvester/src/europe-pmc-client.ts',
  'scripts/harvest-europe-pmc.mjs',
];

const errors = [];

for (const rel of requiredFiles) {
  if (!existsSync(resolve(root, rel))) {
    errors.push(`Falta archivo requerido: ${rel}`);
  }
}

const registry = readFileSync(resolve(root, 'config/source_registry.yaml'), 'utf8');
if (!registry.includes('blocked:') || !registry.includes('scihub')) {
  errors.push('source_registry.yaml debe listar scihub en blocked');
}

if (errors.length) {
  console.error('validate-scaffold FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('validate-scaffold OK — CASE-FORGE-00 scaffold completo');
