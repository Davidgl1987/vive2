import { plans } from '../data/plans';
import { messages } from '../i18n';
import type { CompletedPlan } from '../types/memory';
import type { CompletedChallenge } from '../types/challenge';
import type { CouplePreferences } from '../types/plan';
import type { ReminderSettings } from '../types/reminder';
import type { AppStoreState } from './appStore.types';
import { buildInviteCode } from './appStore.helpers';
import { createActiveChallenge } from './challengeState';

const coupleId = 'couple_001';

export const createDefaultPreferences = (): CouplePreferences => ({
  coupleName: messages.store.defaults.coupleName,
  partnerOneName: messages.store.defaults.partnerOneName,
  partnerTwoName: messages.store.defaults.partnerTwoName,
});

export const createDefaultReminderSettings = (): ReminderSettings => {
  const now = new Date().toISOString();

  return {
    id: 'reminder_001',
    coupleId,
    enabled: true,
    daysBeforePlan: 2,
    notifyOnPlanProposal: true,
    notifyOnDateProposal: true,
    notifyOnPartnerAccepted: true,
    notifyOnConfirmedPlan: true,
    createdAt: now,
    updatedAt: now,
  };
};

const completedChallengeDates = [
  '2026-01-10T18:00:00.000Z',
  '2026-01-17T18:00:00.000Z',
  '2026-01-24T18:00:00.000Z',
  '2026-01-31T18:00:00.000Z',
  '2026-02-07T18:00:00.000Z',
  '2026-02-14T18:00:00.000Z',
  '2026-02-21T18:00:00.000Z',
  '2026-02-28T18:00:00.000Z',
  '2026-03-07T18:00:00.000Z',
  '2026-03-14T18:00:00.000Z',
];

const createSeededMemory = (planIndex: number, date: string): CompletedPlan => {
  const plan = plans[planIndex];

  return {
    id: `memory_seed_${String(planIndex + 1).padStart(3, '0')}`,
    coupleId,
    planId: plan.id,
    planTitle: plan.plan,
    date,
    locationName: messages.store.defaults.seedLocationName,
    locationAddress: messages.store.defaults.seedLocationAddress,
    photos: [plan.cover],
    note: messages.store.defaults.seedNote,
    rating: 5,
    sharedCount: 1,
    addToAlbum: true,
    createdAt: date,
    updatedAt: date,
  };
};

export const createSeededChallengeState = () => {
  const completedMemories = completedChallengeDates.map((date, index) =>
    createSeededMemory(index, date),
  );
  const activeMemory = createSeededMemory(10, '2026-06-17T18:00:00.000Z');
  const completedChallenge: CompletedChallenge = {
    id: 'challenge_seed_completed_001',
    goal: 10,
    memoryIds: completedMemories.map((memory) => memory.id),
    startedAt: completedChallengeDates[0],
    completedAt: completedChallengeDates[completedChallengeDates.length - 1],
  };

  return {
    memories: [activeMemory, ...completedMemories.slice().reverse()],
    activeChallenge: createActiveChallenge(30, [activeMemory.id], activeMemory.createdAt),
    completedChallenges: [completedChallenge],
  };
};

export const createInitialAppStoreState = (): AppStoreState => {
  const challengeState = createSeededChallengeState();

  return {
    coupleId,
    onboardingCompleted: false,
    preferences: createDefaultPreferences(),
    activeChallenge: challengeState.activeChallenge,
    completedChallenges: challengeState.completedChallenges,
    pendingCelebrationChallengeId: undefined,
    plansUnlocked: 8,
    memories: challengeState.memories,
    reminderSettings: createDefaultReminderSettings(),
    customPlans: [],
    agendaItems: [],
    currentPartnerId: 'partner_one',
    inviteCode: buildInviteCode(),
    partnerInviteStatus: 'ready',
    individualModePromoDismissed: false,
    redeemedInviteCode: undefined,
  };
};
