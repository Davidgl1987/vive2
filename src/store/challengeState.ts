import type { CompletedPlan } from '../types/memory';
import type { ChallengeGoal } from '../types/plan';
import type { ActiveChallenge, CompletedChallenge } from '../types/challenge';
import { getNowIso } from '../utils/format';
import { createId } from '../utils/id';

export const createActiveChallenge = (
  goal: ChallengeGoal,
  memoryIds: string[] = [],
  startedAt = getNowIso(),
): ActiveChallenge => ({
  id: `challenge_${createId()}`,
  goal,
  memoryIds,
  startedAt,
});

export const buildChallengeStateFromLegacy = (
  memories: CompletedPlan[],
  goal: ChallengeGoal,
) => {
  const chronologicalMemories = [...memories].sort(
    (first, second) =>
      new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime(),
  );
  const completedChallenges: CompletedChallenge[] = [];
  let remainingMemories = chronologicalMemories;

  while (remainingMemories.length >= goal) {
    const challengeMemories = remainingMemories.slice(0, goal);
    const finalMemory = challengeMemories[challengeMemories.length - 1];
    completedChallenges.unshift({
      id: `challenge_migrated_${completedChallenges.length + 1}`,
      goal,
      memoryIds: challengeMemories.map((memory) => memory.id),
      startedAt: challengeMemories[0]?.createdAt ?? getNowIso(),
      completedAt: finalMemory?.createdAt ?? getNowIso(),
    });
    remainingMemories = remainingMemories.slice(goal);
  }

  const lastCompletedAt = completedChallenges[0]?.completedAt;
  return {
    activeChallenge: createActiveChallenge(
      goal,
      remainingMemories.map((memory) => memory.id),
      remainingMemories[0]?.createdAt ?? lastCompletedAt ?? getNowIso(),
    ),
    completedChallenges,
  };
};
