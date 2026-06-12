# Contrato de exportación EPIS2 — epis2-case-forge

**Versión del contrato:** 0.1.0  
**EPIS2 compatible desde:** migraciones EPIS2-09 (`006_demo_five_cases.sql`)

## Objetivo

Definir cómo un `SyntheticPatient` de Case Forge se materializa en EPIS2 sin acoplar repositorios.

## Códigos demo

| Regla                    | Valor                   |
| ------------------------ | ----------------------- |
| Sistema identificador    | `EPIS2-DEMO`            |
| Reservados EPIS2         | `DEMO-001` … `DEMO-005` |
| Primer código Case Forge | `DEMO-006`              |
| Flag paciente            | `is_synthetic = TRUE`   |
| Etiqueta UI              | `DEMO/SINTÉTICO`        |

Implementación: `@case-forge/contracts` → `EPIS2_RESERVED_DEMO_CODES`, `nextDemoCaseCode()`.

## Mapeo de entidades

### Paciente (`patients`)

| Case Forge    | EPIS2                          |
| ------------- | ------------------------------ |
| `patientId`   | `patients.id` (UUID v4)        |
| `displayName` | `patients.display_name`        |
| `birthDate`   | `patients.birth_date`          |
| `sex`         | `patients.sex`                 |
| `isSynthetic` | `patients.is_synthetic = true` |

### Identificador

```sql
INSERT INTO patient_identifiers (patient_id, system, value, created_by)
VALUES (:patientId, 'EPIS2-DEMO', :demoCaseCode, 'usr-physician-01');
```

### Encuentro (`encounters`)

| Case Forge    | EPIS2                                      |
| ------------- | ------------------------------------------ |
| `encounterId` | `encounters.id`                            |
| —             | `encounters.status = 'open'` (demo activo) |

### Resumen clínico (API / fixtures)

Alineado con `DemoClinicalCase` en `epis2/packages/test-fixtures/src/demoCases.ts`:

```typescript
{
  patientId: string;
  demoCaseCode: string;
  displayName: string;
  birthDate: string;
  sex: 'F' | 'M';
  scenario: string;
  encounterId: string;
  summaryFields: Record<string, string>;
}
```

Campos `summaryFields` mínimos:

- `activeProblems`
- `recentEvents`
- `relevantLabs`
- `activeMedications`
- `pendingItems`
- `clinicalAlerts` (debe incluir `DEMO / SINTÉTICO`)

### Tablas clínicas opcionales (fase 05+)

| Tabla EPIS2       | Origen Case Forge             |
| ----------------- | ----------------------------- |
| `problems`        | Diagnósticos sintetizados     |
| `observations`    | Paraclínicos con jitter       |
| `clinical_notes`  | Notas aprobadas demo          |
| `clinical_drafts` | Borradores `ready_for_review` |

## Formatos de export

| Target           | Uso                   | Ruta sugerida                           |
| ---------------- | --------------------- | --------------------------------------- |
| `epis2-sql`      | Migración incremental | `exports/epis2/NNN_case_forge_seed.sql` |
| `epis2-fixtures` | Tests TS              | `exports/epis2/demoCases.generated.ts`  |
| `epis2-fhir`     | Interop               | `exports/epis2/bundles/DEMO-XXX.json`   |

EPIS2 consume copiando la migración a `database/migrations/` o ejecutando import documentado.

## Validación cruzada

Antes de merge en EPIS2:

1. `npm run check` en case-forge.
2. Import SQL en EPIS2 dev + `npm run db:migrate`.
3. `GET /api/patients/:id` devuelve `demoCaseCode` y `clinicalContext`.
4. UI muestra badge DEMO.

## Servicio futuro (CASE-FORGE-06)

```
POST /export/epis2
{ "target": "epis2-sql", "caseCodes": ["DEMO-006"], "epis2RepoPath": "../epis2" }
```

No implementado en fase 00.
