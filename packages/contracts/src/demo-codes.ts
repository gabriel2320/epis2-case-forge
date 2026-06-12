import { EPIS2_RESERVED_DEMO_CODES } from './schemas.js';

export function isReservedDemoCode(code: string): boolean {
  return (EPIS2_RESERVED_DEMO_CODES as readonly string[]).includes(code);
}

/** Asigna el siguiente código DEMO libre a partir de un conjunto ya usado. */
export function nextDemoCaseCode(usedCodes: Iterable<string>): string {
  const used = new Set(usedCodes);
  for (const reserved of EPIS2_RESERVED_DEMO_CODES) {
    used.add(reserved);
  }
  let n = 6;
  while (used.has(`DEMO-${String(n).padStart(3, '0')}`)) {
    n += 1;
  }
  return `DEMO-${String(n).padStart(3, '0')}`;
}
