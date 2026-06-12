# Roadmap — epis2-case-forge

| Fase              | Nombre                               | Estado       |
| ----------------- | ------------------------------------ | ------------ |
| **CASE-FORGE-00** | Fundación y gobernanza               | **En curso** |
| CASE-FORGE-01     | Registro de fuentes y descubrimiento | Pendiente    |
| CASE-FORGE-02     | Ingesta y extracción estructurada    | Pendiente    |
| CASE-FORGE-03     | Traducción al español                | Pendiente    |
| CASE-FORGE-04     | Sintetización de pacientes           | Pendiente    |
| CASE-FORGE-05     | Mapeo clínico EPIS2                  | Pendiente    |
| CASE-FORGE-06     | Catálogo, API y CLI                  | Pendiente    |
| CASE-FORGE-07     | Integración EPIS2 + Evolab           | Pendiente    |
| CASE-FORGE-08     | QA y diversidad clínica              | Continuo     |
| CASE-FORGE-09     | Automatización y escala              | Pendiente    |
| CASE-FORGE-10     | Laboratorios avanzados               | Opcional     |

## CASE-FORGE-00 — Entregables

- [x] Repositorio `epis2-case-forge`
- [x] `docs/PRODUCT_CANON.md`
- [x] `docs/SOURCE_POLICY.md`
- [x] `docs/EPIS2_EXPORT_CONTRACT.md`
- [x] `@case-forge/contracts` (schemas Zod + demo codes)
- [x] `config/source_registry.yaml` (whitelist inicial)
- [x] CI mínimo (`npm run check`)
- [ ] Repo remoto GitHub + enlace desde EPIS2 README

## Próximo paso (CASE-FORGE-01)

1. Conector Europe PMC (búsqueda `case report` + filtro OA).
2. Indexar ≥ 50 documentos con licencia verificada.
3. Log de procedencia por documento.

## Repos relacionados

| Repo                                                        | Rol                                 |
| ----------------------------------------------------------- | ----------------------------------- |
| [epis2](https://github.com/gabriel2320/epis2)               | EMR command-first — consumidor demo |
| [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) | Laboratorio evolución supervisada   |
