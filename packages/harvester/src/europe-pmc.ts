import type { IndexedSourceDocument, Specialty } from '@case-forge/contracts';

const ICU_KEYWORDS =
  /\b(intensive care|critical care|icu|septic shock|ards|ventilat|hemodynamic|sepsis)\b/i;
const PEDS_KEYWORDS = /\b(pediatric|paediatric|neonat|infant|child|adolescent|newborn|boy|girl)\b/i;
const INTERNAL_KEYWORDS =
  /\b(internal medicine|diabetes|hypertension|heart failure|hepat|renal|nephro|pneumonia|anemia|thyroid|rheumat|cardio|liver|cirrhosis)\b/i;

/** Infiere especialidad a partir de título (+ opcional journal). */
export function inferSpecialty(title: string, journal?: string): Specialty {
  const text = `${title} ${journal ?? ''}`;
  if (ICU_KEYWORDS.test(text)) return 'critical_care';
  if (PEDS_KEYWORDS.test(text)) return 'pediatrics';
  if (INTERNAL_KEYWORDS.test(text)) return 'internal_medicine';
  return 'other';
}

/** Prioriza especialidad declarada en la query de harvest si hay señal débil en título. */
export function resolveSpecialty(
  title: string,
  journal: string | undefined,
  querySpecialties: Specialty[],
): Specialty {
  const inferred = inferSpecialty(title, journal);
  if (inferred !== 'other') return inferred;
  if (querySpecialties.length === 1) return querySpecialties[0]!;
  return 'other';
}

export type EuropePmcResult = {
  id?: string;
  source?: string;
  pmcid?: string;
  pmid?: string;
  doi?: string;
  title?: string;
  authorString?: string;
  journalTitle?: string;
  pubYear?: string;
  firstPublicationDate?: string;
  language?: string;
  isOpenAccess?: string;
  inPMC?: string;
};

export type EuropePmcSearchResponse = {
  hitCount?: number;
  nextCursorMark?: string;
  resultList?: { result?: EuropePmcResult[] };
};

export function mapEuropePmcResult(
  row: EuropePmcResult,
  opts: {
    sourceId: string;
    searchQuery: string;
    querySpecialties: Specialty[];
    harvestedAt: string;
  },
): IndexedSourceDocument | null {
  const title = row.title?.trim();
  if (!title) return null;

  const isOpenAccess = row.isOpenAccess === 'Y';
  const inPmc = row.inPMC === 'Y';
  const licenseVerified = isOpenAccess && inPmc;
  if (!licenseVerified) return null;

  const pmcid = row.pmcid?.replace(/^PMC/i, 'PMC') || undefined;
  const pmid = row.pmid;
  const doi = row.doi;
  const url = pmcid
    ? `https://europepmc.org/article/PMC/${pmcid.replace(/^PMC/i, '')}`
    : pmid
      ? `https://europepmc.org/article/MED/${pmid}`
      : doi
        ? `https://doi.org/${doi}`
        : null;
  if (!url) return null;

  const publishedAt = normalizeDate(row.firstPublicationDate, row.pubYear);
  const sourceLanguage = normalizeLanguage(row.language);

  return {
    id: crypto.randomUUID(),
    doi,
    url,
    title,
    journal: row.journalTitle,
    publishedAt,
    sourceLanguage,
    license: 'europepmc-oa',
    specialty: resolveSpecialty(title, row.journalTitle, opts.querySpecialties),
    harvestedAt: opts.harvestedAt,
    licenseVerified: true,
    sourceId: opts.sourceId,
    pmcid,
    pmid,
    searchQuery: opts.searchQuery,
    isOpenAccess,
    inPmc,
    authorString: row.authorString,
  };
}

function normalizeDate(firstPublicationDate?: string, pubYear?: string): string | undefined {
  if (firstPublicationDate && /^\d{4}-\d{2}-\d{2}/.test(firstPublicationDate)) {
    return firstPublicationDate.slice(0, 10);
  }
  if (pubYear && /^\d{4}$/.test(pubYear)) return `${pubYear}-01-01`;
  return undefined;
}

function normalizeLanguage(code?: string): string {
  if (!code) return 'und';
  const c = code.toLowerCase().slice(0, 3);
  const map: Record<string, string> = {
    eng: 'en',
    en: 'en',
    spa: 'es',
    es: 'es',
    fre: 'fr',
    fr: 'fr',
    ger: 'de',
    de: 'de',
    por: 'pt',
    pt: 'pt',
    ita: 'it',
    it: 'it',
  };
  return map[c] ?? c.slice(0, 2);
}

/** Deduplica por pmcid, pmid o doi. */
export function dedupeDocuments(docs: IndexedSourceDocument[]): IndexedSourceDocument[] {
  const seen = new Set<string>();
  const out: IndexedSourceDocument[] = [];
  for (const doc of docs) {
    const key = doc.pmcid ?? doc.pmid ?? doc.doi ?? doc.url;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(doc);
  }
  return out;
}
