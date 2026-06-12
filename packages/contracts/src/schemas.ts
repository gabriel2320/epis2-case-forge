import { z } from 'zod';

/** Especialidades con cuota prioritaria en el catálogo inicial. */
export const specialtySchema = z.enum([
  'internal_medicine',
  'pediatrics',
  'critical_care',
  'emergency',
  'other',
]);

export type Specialty = z.infer<typeof specialtySchema>;

/** Licencias aceptadas para ingestión (ver docs/SOURCE_POLICY.md). */
export const sourceLicenseSchema = z.enum([
  'cc-by',
  'cc-by-sa',
  'cc-by-nc',
  'cc0',
  'pmc-oa',
  'europepmc-oa',
  'publisher-oa',
  'unknown',
]);

export type SourceLicense = z.infer<typeof sourceLicenseSchema>;

export const sourceDocumentSchema = z.object({
  id: z.string().uuid(),
  doi: z.string().optional(),
  url: z.url(),
  title: z.string().min(1),
  journal: z.string().optional(),
  publishedAt: z.string().date().optional(),
  sourceLanguage: z.string().min(2).max(8),
  license: sourceLicenseSchema,
  specialty: specialtySchema,
  harvestedAt: z.string().datetime(),
  licenseVerified: z.boolean(),
});

export type SourceDocument = z.infer<typeof sourceDocumentSchema>;

/** Caso clínico extraído del documento fuente (pre-sintetización). */
export const extractedCaseSchema = z.object({
  id: z.string().uuid(),
  sourceDocumentId: z.string().uuid(),
  specialty: specialtySchema,
  presentation: z.string().min(1),
  history: z.string().optional(),
  physicalExam: z.string().optional(),
  diagnostics: z.string().optional(),
  hospitalCourse: z.string().optional(),
  treatment: z.string().optional(),
  outcome: z.string().optional(),
  primaryDiagnosis: z.string().min(1),
  secondaryDiagnoses: z.array(z.string()).default([]),
  textOriginal: z.string().min(1),
  textEs: z.string().min(1),
  extractionVersion: z.string().default('0.1.0'),
});

export type ExtractedCase = z.infer<typeof extractedCaseSchema>;

/** Paciente sintético listo para exportar a EPIS2 (L0). */
export const syntheticPatientSchema = z.object({
  patientId: z.string().uuid(),
  demoCaseCode: z.string().regex(/^DEMO-\d{3,}$/, 'Formato DEMO-XXX (mínimo 3 dígitos)'),
  displayName: z.string().min(1),
  birthDate: z.string().date(),
  sex: z.enum(['F', 'M']),
  scenario: z.string().min(1),
  encounterId: z.string().uuid(),
  specialty: specialtySchema,
  isSynthetic: z.literal(true),
  summaryFields: z.record(z.string(), z.string()),
  sourceDocumentId: z.string().uuid(),
  extractedCaseId: z.string().uuid(),
  syntheticLabel: z.literal('DEMO/SINTÉTICO'),
});

export type SyntheticPatient = z.infer<typeof syntheticPatientSchema>;

export const qaStatusSchema = z.enum([
  'pending',
  'auto_passed',
  'needs_review',
  'approved',
  'rejected',
]);

export type QaStatus = z.infer<typeof qaStatusSchema>;

export const exportRunSchema = z.object({
  id: z.string().uuid(),
  target: z.enum(['epis2-sql', 'epis2-fixtures', 'epis2-fhir']),
  caseCodes: z.array(z.string()),
  exportedAt: z.string().datetime(),
  epis2RepoPath: z.string().optional(),
  migrationFilename: z.string().optional(),
});

export type ExportRun = z.infer<typeof exportRunSchema>;

/** Códigos reservados en EPIS2 — no reutilizar (EPIS2-09). */
export const EPIS2_RESERVED_DEMO_CODES = [
  'DEMO-001',
  'DEMO-002',
  'DEMO-003',
  'DEMO-004',
  'DEMO-005',
] as const;

export const EPIS2_DEMO_IDENTIFIER_SYSTEM = 'EPIS2-DEMO' as const;
export const CASE_FORGE_MIN_DEMO_CODE = 'DEMO-006' as const;
