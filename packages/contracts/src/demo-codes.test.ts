import { describe, expect, it } from 'vitest';
import { isReservedDemoCode, nextDemoCaseCode } from './demo-codes.js';

describe('demo-codes', () => {
  it('marca DEMO-001…005 como reservados', () => {
    expect(isReservedDemoCode('DEMO-001')).toBe(true);
    expect(isReservedDemoCode('DEMO-005')).toBe(true);
    expect(isReservedDemoCode('DEMO-006')).toBe(false);
  });

  it('asigna DEMO-006 cuando el catálogo está vacío', () => {
    expect(nextDemoCaseCode([])).toBe('DEMO-006');
  });

  it('salta códigos ya usados', () => {
    expect(nextDemoCaseCode(['DEMO-006', 'DEMO-007'])).toBe('DEMO-008');
  });
});
