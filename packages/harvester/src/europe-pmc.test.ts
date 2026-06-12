import { describe, expect, it } from 'vitest';
import type { Specialty } from '@case-forge/contracts';
import {
  dedupeDocuments,
  inferSpecialty,
  mapEuropePmcResult,
  resolveSpecialty,
} from './europe-pmc.js';

describe('inferSpecialty', () => {
  it('detecta UCI', () => {
    expect(inferSpecialty('Septic shock in intensive care unit')).toBe('critical_care');
  });

  it('detecta pediatría', () => {
    expect(inferSpecialty('Pediatric case of Kawasaki disease')).toBe('pediatrics');
  });

  it('detecta medicina interna', () => {
    expect(inferSpecialty('Hypertension and heart failure case report')).toBe('internal_medicine');
  });
});

describe('mapEuropePmcResult', () => {
  const base = {
    sourceId: 'europe_pmc_oa',
    searchQuery: '(CASE REPORT) AND (OPEN_ACCESS:Y)',
    querySpecialties: ['internal_medicine'] as Specialty[],
    harvestedAt: '2026-06-12T12:00:00.000Z',
  };

  it('mapea documento OA verificado', () => {
    const doc = mapEuropePmcResult(
      {
        pmcid: 'PMC1234567',
        pmid: '99999999',
        doi: '10.1186/s13256-024-01234-5',
        title: 'Pediatric case of Kawasaki disease',
        journalTitle: 'Journal of Medical Case Reports',
        pubYear: '2024',
        language: 'eng',
        isOpenAccess: 'Y',
        inPMC: 'Y',
        authorString: 'Smith J',
      },
      { ...base, querySpecialties: ['pediatrics'] },
    );
    expect(doc).not.toBeNull();
    expect(doc!.licenseVerified).toBe(true);
    expect(doc!.license).toBe('europepmc-oa');
    expect(doc!.specialty).toBe('pediatrics');
    expect(doc!.url).toContain('PMC/1234567');
    expect(doc!.sourceLanguage).toBe('en');
  });

  it('rechaza no open access', () => {
    expect(
      mapEuropePmcResult(
        {
          title: 'Closed case',
          isOpenAccess: 'N',
          inPMC: 'Y',
        },
        base,
      ),
    ).toBeNull();
  });
});

describe('dedupeDocuments', () => {
  it('elimina duplicados por pmcid', () => {
    const mk = (pmcid: string) =>
      mapEuropePmcResult(
        {
          pmcid,
          title: `Case ${pmcid}`,
          isOpenAccess: 'Y',
          inPMC: 'Y',
        },
        {
          sourceId: 'europe_pmc_oa',
          searchQuery: 'q',
          querySpecialties: ['other'],
          harvestedAt: '2026-06-12T12:00:00.000Z',
        },
      )!;
    const docs = dedupeDocuments([mk('PMC1'), mk('PMC1'), mk('PMC2')]);
    expect(docs).toHaveLength(2);
  });
});

describe('resolveSpecialty', () => {
  it('usa especialidad de query si inferencia es other', () => {
    expect(resolveSpecialty('Unusual presentation', undefined, ['critical_care'])).toBe(
      'critical_care',
    );
  });
});
