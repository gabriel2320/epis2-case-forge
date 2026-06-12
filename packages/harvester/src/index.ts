export {
  EuropePmcClient,
  type EuropePmcClientOptions,
  type HarvestQuery,
} from './europe-pmc-client.js';
export {
  dedupeDocuments,
  inferSpecialty,
  mapEuropePmcResult,
  resolveSpecialty,
  type EuropePmcResult,
  type EuropePmcSearchResponse,
} from './europe-pmc.js';
export {
  defaultCatalogPath,
  mergeCatalogDocuments,
  readCatalog,
  writeCatalog,
} from './catalog-store.js';
