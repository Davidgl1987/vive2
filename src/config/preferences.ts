import { messages } from '../i18n';
import type { BudgetPreference, PlanLocation } from '../types/plan';

export const interestOptions = [
  { icon: '🍝', value: 'gastronomia' },
  { icon: '🎵', value: 'musica' },
  { icon: '🌿', value: 'naturaleza' },
  { icon: '🖼️', value: 'cultura' },
  { icon: '🛁', value: 'relax' },
  { icon: '🗺️', value: 'aventura' },
  { icon: '🎲', value: 'juegos' },
  { icon: '🎨', value: 'creatividad' },
] as const;

export const interestValues = interestOptions.map((option) => option.value) as [
  (typeof interestOptions)[0]['value'],
  ...(typeof interestOptions)[number]['value'][],
];

export type InterestValue = (typeof interestValues)[number];

export const budgetPreferenceValues = [
  'gratis',
  'bajo',
  'medio',
  'alto',
  'variable',
] as const satisfies readonly BudgetPreference[];

export const customPlanLocationValues = [
  'mixto',
  'en casa',
  'exterior',
] as const satisfies readonly PlanLocation[];

export const budgetOptions = budgetPreferenceValues.map((value) => ({
  label: messages.preferences.budget[value],
  value,
}));

export const customPlanLocationOptions = customPlanLocationValues.map((value) => ({
  label: messages.preferences.customPlanLocation[value],
  value,
}));
