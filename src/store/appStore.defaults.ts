import type { CouplePreferences } from '../types/plan';
import type { ReminderSettings } from '../types/reminder';
import { createId } from '../utils/id';
import type { AppStoreState } from './appStore.types';
import { buildInviteCode } from './appStore.helpers';
import { createActiveChallenge } from './challengeState';

export const createDefaultPreferences = (): CouplePreferences => ({
  coupleName: '',
  partnerOneName: '',
  partnerTwoName: '',
});

export const createDefaultReminderSettings = (coupleId: string): ReminderSettings => {
  const now = new Date().toISOString();

  return {
    id: `reminder_${createId()}`,
    coupleId,
    enabled: false,
    daysBeforePlan: 2,
    notifyOnPlanProposal: true,
    notifyOnDateProposal: true,
    notifyOnPartnerAccepted: true,
    notifyOnConfirmedPlan: true,
    createdAt: now,
    updatedAt: now,
  };
};

export const createInitialAppStoreState = (): AppStoreState => {
  const coupleId = `couple_${createId()}`;

  return {
    coupleId,
    onboardingCompleted: false,
    preferences: createDefaultPreferences(),
    activeChallenge: createActiveChallenge(10),
    completedChallenges: [],
    pendingCelebrationChallengeId: undefined,
    plansUnlocked: 8,
    memories: [],
    reminderSettings: createDefaultReminderSettings(coupleId),
    customPlans: [],
    agendaItems: [],
    currentPartnerId: 'partner_one',
    inviteCode: buildInviteCode(),
    partnerInviteStatus: 'ready',
    individualModePromoDismissed: false,
    redeemedInviteCode: undefined,
  };
};
