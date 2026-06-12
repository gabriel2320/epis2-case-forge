import type { Specialty } from '@case-forge/contracts';
import { dedupeDocuments, mapEuropePmcResult, type EuropePmcSearchResponse } from './europe-pmc.js';

export type HarvestQuery = {
  query: string;
  specialties: Specialty[];
};

export type EuropePmcClientOptions = {
  baseUrl?: string;
  pageSize?: number;
  userAgent?: string;
  fetchImpl?: typeof fetch;
  delayMs?: number;
};

const DEFAULT_BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest';

export class EuropePmcClient {
  private readonly baseUrl: string;
  private readonly pageSize: number;
  private readonly userAgent: string;
  private readonly fetchImpl: typeof fetch;
  private readonly delayMs: number;

  constructor(opts: EuropePmcClientOptions = {}) {
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE).replace(/\/$/, '');
    this.pageSize = opts.pageSize ?? 100;
    this.userAgent =
      opts.userAgent ?? 'epis2-case-forge/0.1 (+https://github.com/gabriel2320/epis2-case-forge)';
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.delayMs = opts.delayMs ?? 200;
  }

  async searchPage(query: string, cursorMark = '*'): Promise<EuropePmcSearchResponse> {
    const url = new URL(`${this.baseUrl}/search`);
    url.searchParams.set('query', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('pageSize', String(this.pageSize));
    url.searchParams.set('cursorMark', cursorMark);

    const res = await this.fetchImpl(url, {
      headers: { 'User-Agent': this.userAgent, Accept: 'application/json' },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      throw new Error(`Europe PMC search failed: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as EuropePmcSearchResponse;
  }

  async harvestQuery(
    sourceId: string,
    { query, specialties }: HarvestQuery,
    opts: { maxResults?: number; harvestedAt?: string } = {},
  ): Promise<{
    query: string;
    specialties: Specialty[];
    hitCount: number;
    documents: ReturnType<typeof mapEuropePmcResult>[];
  }> {
    const maxResults = opts.maxResults ?? 100;
    const harvestedAt = opts.harvestedAt ?? new Date().toISOString();
    const documents: NonNullable<ReturnType<typeof mapEuropePmcResult>>[] = [];
    let cursorMark = '*';
    let hitCount = 0;
    let pages = 0;

    while (documents.length < maxResults && pages < 20) {
      const page = await this.searchPage(query, cursorMark);
      hitCount = page.hitCount ?? hitCount;
      const rows = page.resultList?.result ?? [];
      for (const row of rows) {
        const mapped = mapEuropePmcResult(row, {
          sourceId,
          searchQuery: query,
          querySpecialties: specialties,
          harvestedAt,
        });
        if (mapped) documents.push(mapped);
        if (documents.length >= maxResults) break;
      }
      const next = page.nextCursorMark;
      if (!next || next === cursorMark || rows.length === 0) break;
      cursorMark = next;
      pages += 1;
      if (this.delayMs > 0) await sleep(this.delayMs);
    }

    return {
      query,
      specialties,
      hitCount,
      documents: dedupeDocuments(documents),
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
