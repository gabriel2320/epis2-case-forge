# Product canon — epis2-case-forge

**Versión:** 0.1.0 (CASE-FORGE-00)  
**Estado:** Fundación

## Qué es

**epis2-case-forge** es un repositorio **paralelo y desacoplado** de [EPIS2](https://github.com/gabriel2320/epis2). Convierte casos clínicos publicados en fuentes de **acceso abierto y licencia verificada** en **pacientes sintéticos** (`L0_synthetic`) que alimentan:

- La base demo de EPIS2 (desarrollo local, E2E, migraciones seed).
- [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) y laboratorios asociados.
- Fixtures TypeScript compatibles con `packages/test-fixtures` de EPIS2.

## Qué no es

- **No** es un módulo dentro del monorepo EPIS2.
- **No** almacena ni procesa PHI real.
- **No** copia casos clínicos tal cual a la base demo: siempre **re-sintetiza** demografía, identificadores, fechas y valores numéricos.
- **No** integra Sci-Hub, bypass de paywalls ni scraping de contenido con licencia incierta o prohibida.
- **No** sustituye revisión clínica humana en la fase inicial del catálogo.

## Principios no negociables

1. **Trazabilidad:** cada paciente sintético enlaza a `source_document` + `extracted_case` + `export_run`.
2. **Español canónico:** extracción multilingüe; export a EPIS2 solo en español clínico.
3. **Badge DEMO:** todo export lleva `is_synthetic = true` y etiqueta `DEMO/SINTÉTICO`.
4. **Respeto de reservas EPIS2:** `DEMO-001` … `DEMO-005` son intocables; Case Forge empieza en `DEMO-006+`.
5. **Prioridad clínica:** medicina interna, pediatría y cuidados intensivos ≥ 60% del catálogo MVP.

## Especialidades objetivo

| Especialidad        | Código               | Cuota MVP |
| ------------------- | -------------------- | --------- |
| Medicina interna    | `internal_medicine`  | ≥ 30%     |
| Pediatría           | `pediatrics`         | ≥ 30%     |
| Cuidados intensivos | `critical_care`      | ≥ 30%     |
| Urgencia / otros    | `emergency`, `other` | resto     |

## Integración con EPIS2

Ver [EPIS2_EXPORT_CONTRACT.md](./EPIS2_EXPORT_CONTRACT.md).

Flujo:

```
Fuente OA → extracción → traducción ES → sintetización → QA → export SQL/fixtures/FHIR → EPIS2
```

## Documentos relacionados

| Documento                                              | Propósito                  |
| ------------------------------------------------------ | -------------------------- |
| [SOURCE_POLICY.md](./SOURCE_POLICY.md)                 | Fuentes legales permitidas |
| [EPIS2_EXPORT_CONTRACT.md](./EPIS2_EXPORT_CONTRACT.md) | Contrato de exportación    |
| [ROADMAP.md](./ROADMAP.md)                             | Fases CASE-FORGE-00 … 10   |
