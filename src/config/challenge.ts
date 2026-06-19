import { messages } from '../i18n';
import type { ChallengeGoal } from '../types/plan';

export const challengeGoalValues = [10, 20, 30] as const satisfies readonly ChallengeGoal[];

export const challengeGoalOptions = challengeGoalValues.map((value) => ({
  value,
  label: messages.challenge.levels[String(value) as '10' | '20' | '30'].label,
  description: messages.challenge.levels[String(value) as '10' | '20' | '30'].description,
}));
