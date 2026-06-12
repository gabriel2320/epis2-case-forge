# epis2-case-forge

Generador de **pacientes sintéticos** para [EPIS2](https://github.com/gabriel2320/epis2): casos clínicos de fuentes **open access** → traducción al español → de-identificación → base demo `L0_synthetic`.

Repositorio **paralelo y desacoplado** (mismo patrón que [epis2-evolab](https://github.com/gabriel2320/epis2-evolab)).

## Estado

| Fase               | Estado                                 |
| ------------------ | -------------------------------------- |
| **CASE-FORGE-00**  | Fundación — scaffold, canon, contratos |
| CASE-FORGE-01 … 10 | Ver [docs/ROADMAP.md](docs/ROADMAP.md) |

## Principios

- Solo fuentes OA con licencia verificada — **sin Sci-Hub** ([SOURCE_POLICY.md](docs/SOURCE_POLICY.md)).
- Todo export a EPIS2: `is_synthetic = true`, badge `DEMO/SINTÉTICO`.
- Códigos `DEMO-001`…`005` reservados por EPIS2; Case Forge usa `DEMO-006+`.
- Prioridad: medicina interna, pediatría, UCI.

## Estructura

```
epis2-case-forge/
  config/source_registry.yaml   # Whitelist de fuentes
  docs/                         # Canon, política, contrato EPIS2, roadmap
  packages/contracts/           # Schemas Zod + reglas DEMO
  exports/                      # SQL / fixtures generados (gitignored)
  scripts/                      # Validación y futuros harvest/export
```

## Desarrollo

```bash
npm install
npm run check    # format + typecheck + test + validate scaffold
npm run build
npm test
```

Requiere Node 20+ (`.nvmrc`).

## Documentación

| Documento                                                      | Propósito           |
| -------------------------------------------------------------- | ------------------- |
| [docs/PRODUCT_CANON.md](docs/PRODUCT_CANON.md)                 | Visión y límites    |
| [docs/SOURCE_POLICY.md](docs/SOURCE_POLICY.md)                 | Fuentes legales     |
| [docs/EPIS2_EXPORT_CONTRACT.md](docs/EPIS2_EXPORT_CONTRACT.md) | Mapeo a EPIS2       |
| [docs/ROADMAP.md](docs/ROADMAP.md)                             | Fases de desarrollo |

## Integración EPIS2 (futuro)

```bash
# CASE-FORGE-06+
case-forge export --target epis2-sql --cases DEMO-006 --epis2 ../epis2
```

## Licencia

Privado — uso interno desarrollo EPIS2 / gabriel2320.
