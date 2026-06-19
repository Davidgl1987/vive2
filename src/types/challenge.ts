import type { ChallengeGoal } from './plan';

export type ActiveChallenge = {
  id: string;
  goal: ChallengeGoal;
  memoryIds: string[];
  startedAt: string;
};

export type CompletedChallenge = ActiveChallenge & {
  completedAt: string;
};
