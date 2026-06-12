# Roadmap — epis2-case-forge

| Fase              | Nombre                               | Estado       |
| ----------------- | ------------------------------------ | ------------ |
| **CASE-FORGE-00** | Fundación y gobernanza               | Completada   |
| **CASE-FORGE-01** | Registro de fuentes y descubrimiento | Completada   |
| **CASE-FORGE-02** | Ingesta y extracción estructurada    | **En curso** |
| CASE-FORGE-03     | Traducción al español                | Pendiente    |
| CASE-FORGE-04     | Sintetización de pacientes           | Pendiente    |
| CASE-FORGE-05     | Mapeo clínico EPIS2                  | Pendiente    |
| CASE-FORGE-06     | Catálogo, API y CLI                  | Pendiente    |
| CASE-FORGE-07     | Integración EPIS2 + Evolab           | Pendiente    |
| CASE-FORGE-08     | QA y diversidad clínica              | Continuo     |
| CASE-FORGE-09     | Automatización y escala              | Pendiente    |
| CASE-FORGE-10     | Laboratorios avanzados               | Opcional     |

## CASE-FORGE-01 — Entregables

- [x] Paquete `@case-forge/harvester` — cliente Europe PMC
- [x] `npm run harvest:europe-pmc` — indexación OA con trazabilidad
- [x] Catálogo JSON `data/catalog/europe_pmc_oa.json`
- [x] ≥ 50 documentos con licencia verificada (80 indexados en harvest inicial)

## Próximo paso (CASE-FORGE-02)

1. Parser HTML/PDF para extraer secciones clínicas estructuradas.
2. Schema `ExtractedCase` poblado desde catálogo.

## Repos relacionados

| Repo                                                        | Rol                                 |
| ----------------------------------------------------------- | ----------------------------------- |
| [epis2](https://github.com/gabriel2320/epis2)               | EMR command-first — consumidor demo |
| [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) | Laboratorio evolución supervisada   |
