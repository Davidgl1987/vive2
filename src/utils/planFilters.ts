import type { BudgetPreference, CouplePlan, PlanLocation } from '../types/plan';
import type { InterestValue } from '../config/preferences';

export type PlanFilters = {
  budget: BudgetPreference | 'todos';
  location: PlanLocation | 'todos';
  type: InterestValue | 'todos';
};

export const emptyPlanFilters: PlanFilters = {
  budget: 'todos',
  location: 'todos',
  type: 'todos',
};

const categoriesByType: Record<InterestValue, string[]> = {
  gastronomia: ['gastronomico'],
  musica: ['musica'],
  naturaleza: ['aventura', 'paseo', 'viaje'],
  cultura: ['cultura', 'descubrir'],
  relax: ['relax', 'bienestar'],
  aventura: ['aventura', 'deporte', 'viaje'],
  juegos: ['juegos', 'divertido'],
  creatividad: ['creatividad', 'fotografia'],
};

export const matchesPlanFilters = (plan: CouplePlan, filters: PlanFilters) => {
  const matchesBudget = filters.budget === 'todos' || plan.presupuesto === filters.budget;
  const matchesLocation = filters.location === 'todos' || plan.ubicacion === filters.location;
  const matchesType =
    filters.type === 'todos' ||
    categoriesByType[filters.type].some((category) => plan.categoria.includes(category));

  return matchesBudget && matchesLocation && matchesType;
};
