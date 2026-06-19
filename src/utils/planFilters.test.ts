import { describe, expect, it } from 'vitest';
import type { CouplePlan } from '../types/plan';
import { emptyPlanFilters, matchesPlanFilters } from './planFilters';

const plan = {
  presupuesto: 'bajo',
  ubicacion: 'exterior',
  categoria: ['gastronomico', 'romantico'],
} as CouplePlan;

describe('matchesPlanFilters', () => {
  it('accepts a plan when no filters are selected', () => {
    expect(matchesPlanFilters(plan, emptyPlanFilters)).toBe(true);
  });

  it('combines budget, location and type filters', () => {
    expect(
      matchesPlanFilters(plan, {
        budget: 'bajo',
        location: 'exterior',
        type: 'gastronomia',
      }),
    ).toBe(true);

    expect(
      matchesPlanFilters(plan, {
        budget: 'gratis',
        location: 'exterior',
        type: 'gastronomia',
      }),
    ).toBe(false);
  });

  it('maps broad interests to the catalog categories', () => {
    expect(matchesPlanFilters({ ...plan, categoria: ['bienestar'] }, { ...emptyPlanFilters, type: 'relax' })).toBe(true);
    expect(matchesPlanFilters({ ...plan, categoria: ['fotografia'] }, { ...emptyPlanFilters, type: 'creatividad' })).toBe(true);
  });
});
