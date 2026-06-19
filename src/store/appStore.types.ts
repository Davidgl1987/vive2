import type { CompletedPlan } from '../types/memory';
import type { ActiveChallenge, CompletedChallenge } from '../types/challenge';
import type {
  AgendaItem,
  CouplePlan,
  CouplePreferences,
  ChallengeGoal,
  PartnerId,
  PartnerInviteStatus,
} from '../types/plan';
import type { ReminderSettings } from '../types/reminder';
import type { InvitePayload } from '../utils/invite';

export type AppStoreState = {
  coupleId: string;
  onboardingCompleted: boolean;
  preferences: CouplePreferences;
  activeChallenge: ActiveChallenge;
  completedChallenges: CompletedChallenge[];
  pendingCelebrationChallengeId?: string;
  plansUnlocked: number;
  memories: CompletedPlan[];
  reminderSettings: ReminderSettings;
  customPlans: CouplePlan[];
  agendaItems: AgendaItem[];
  currentPartnerId: PartnerId;
  inviteCode: string;
  partnerInviteStatus: PartnerInviteStatus;
  individualModePromoDismissed: boolean;
  redeemedInviteCode?: string;
};

export type AppStoreActions = {
  completeOnboarding: (preferences: CouplePreferences) => void;
  saveMemory: (memory: CompletedPlan) => void;
  updateReminderSettings: (settings: ReminderSettings) => void;
  updatePreferences: (preferences: CouplePreferences) => void;
  setChallengeGoal: (goal: ChallengeGoal) => void;
  dismissChallengeCelebration: () => void;
  addCustomPlan: (idea: string, makeNext?: boolean) => string;
  updateCustomPlan: (planId: string, updates: Partial<CouplePlan>) => void;
  proposeAgendaPlan: (planId: string) => string;
  acceptAgendaPlan: (agendaItemId: string) => void;
  setAgendaDate: (agendaItemId: string, date: string) => void;
  acceptAgendaDate: (agendaItemId: string, date?: string) => void;
  cancelAgendaItem: (agendaItemId: string) => void;
  completeAgendaItemByPlan: (planId: string) => void;
  setCurrentPartner: (partnerId: PartnerId) => void;
  markPartnerLinked: () => void;
  setPartnerLinked: (linked: boolean) => void;
  setPairModeEnabled: (enabled: boolean) => void;
  redeemInviteCode: (
    code: string,
    options?: { partnerId?: PartnerId; payload?: InvitePayload },
  ) => { ok: boolean; message?: string };
  dismissIndividualModePromo: () => void;
  showIndividualModePromo: () => void;
  signOut: () => void;
};

export type AppState = AppStoreState & AppStoreActions;
