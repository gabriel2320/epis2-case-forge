# Agentes — epis2-case-forge

## Contexto

Repo hermano de **EPIS2**. No importar código clínico de EPIS2. Integración solo vía contratos en `docs/EPIS2_EXPORT_CONTRACT.md` y paquete `@case-forge/contracts`.

## Reglas

1. **Nunca** integrar Sci-Hub ni bypass de paywalls.
2. **Nunca** exportar PHI o texto original sin sintetizar a EPIS2.
3. Respetar `DEMO-001`…`DEMO-005` reservados.
4. Español canónico en exports; multilingüe solo en catálogo interno.
5. Priorizar especialidades: `internal_medicine`, `pediatrics`, `critical_care`.

## Comandos

```bash
npm run check
npm run build
npm test
node scripts/validate-scaffold.mjs
```

## Fase actual

**CASE-FORGE-00** — ver [docs/ROADMAP.md](docs/ROADMAP.md).

Próximo: CASE-FORGE-02 — extracción estructurada (HTML/PDF → `ExtractedCase`).
