#!/usr/bin/env node
import { readCatalog, defaultCatalogPath } from '@case-forge/harvester';

const path = defaultCatalogPath();
const catalog = readCatalog(path);
if (!catalog) {
  console.error(`No catalog at ${path}`);
  process.exit(1);
}

const bySpecialty = {};
for (const doc of catalog.documents) {
  bySpecialty[doc.specialty] = (bySpecialty[doc.specialty] ?? 0) + 1;
}

console.log(`Catalog: ${path}`);
console.log(`Source: ${catalog.sourceId}`);
console.log(`Updated: ${catalog.updatedAt}`);
console.log(`Documents: ${catalog.documents.length}`);
console.log(`By specialty:`, bySpecialty);
console.log(`License verified: ${catalog.documents.filter((d) => d.licenseVerified).length}`);
