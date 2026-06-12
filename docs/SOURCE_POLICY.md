# Política de fuentes — epis2-case-forge

**CASE-FORGE-00** — whitelist y reglas de ingestión.

## Regla general

Solo se ingiere contenido cuando se puede **demostrar** derecho de acceso y reutilización para extracción estructurada con fines de investigación/demos sintéticos.

## Fuentes permitidas (whitelist)

| Fuente                                                                         | Método                                   | Licencia típica           |
| ------------------------------------------------------------------------------ | ---------------------------------------- | ------------------------- |
| [Europe PMC Open Access](https://europepmc.org/)                               | API REST / OAI                           | PMC-OA, CC                |
| [PubMed Central OA subset](https://www.ncbi.nlm.nih.gov/pmc/tools/openftlist/) | OAI-PMH / FTP                            | PMC-OA                    |
| [DOAJ](https://doaj.org/)                                                      | API metadatos                            | Revistas OA peer-reviewed |
| _Journal of Medical Case Reports_                                              | Web / API donde exista                   | CC BY                     |
| _Cureus_                                                                       | Web (rate-limited)                       | CC BY                     |
| Repositorios institucionales                                                   | Solo con metadatos de licencia explícita | CC / OA publisher         |

Configuración viva: [`config/source_registry.yaml`](../config/source_registry.yaml).

## Fuentes prohibidas

- **Sci-Hub** y cualquier proxy de artículos con paywall.
- Scraping agresivo que viole `robots.txt` o términos de servicio.
- Contenido sin metadatos de licencia verificable → `license: unknown` → **no exportar**.
- Foros, redes sociales o blogs sin licencia clara.

## Verificación de licencia

Cada `source_document` debe registrar:

- `license` (enum en `@case-forge/contracts`)
- `licenseVerified: true` solo tras comprobación manual o regla automática documentada
- `url` y `doi` cuando existan

Si `licenseVerified === false`, el caso **no** avanza a sintetización automática.

## Rate limiting y cache

- Respetar límites de API publicados.
- Cache local en `.harvest-cache/` (gitignored).
- User-Agent identificable: `epis2-case-forge/0.1 (+https://github.com/gabriel2320/epis2-case-forge)`.

## De-identificación

Incluso con fuentes OA, los case reports pueden contener datos personales. Pipeline obligatorio:

1. Extracción estructurada.
2. Detección NER de nombres, fechas, lugares.
3. **Sintetización** de demografía y valores antes de export.

Nunca exportar `textOriginal` a EPIS2 — solo `textEs` ya transformado.

## Revisión

Casos con score QA bajo van a cola `needs_review`. Export automático solo tras fase CASE-FORGE-09.
