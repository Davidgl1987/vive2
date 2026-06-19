import localizedPlanSeeds from '../i18n/es/plans.json';
import { interpolate, messages } from '../i18n';
import type { CouplePlan } from '../types/plan';

type LocalizedPlanSeed = Omit<
  CouplePlan,
  'id' | 'textoCompartir' | 'albumPrompt' | 'preguntaRecuerdo'
> & {
  question: string;
};

const planSeeds = localizedPlanSeeds as LocalizedPlanSeed[];

export const plans: CouplePlan[] = planSeeds.map((seed, index) => ({
  ...seed,
  id: `plan_${String(index + 1).padStart(3, '0')}`,
  preguntaRecuerdo: seed.question,
  textoCompartir: interpolate(messages.data.plans.shareTemplate, {
    plan: seed.plan,
  }),
  albumPrompt: interpolate(messages.data.plans.albumPromptTemplate, {
    plan: seed.plan.toLowerCase(),
  }),
}));
