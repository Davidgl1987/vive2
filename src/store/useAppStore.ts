import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createId } from '../utils/id';
import { validateInviteCodeInput } from '../utils/invite';
import { createCustomPlan } from '../utils/plans';
import { getNowIso } from '../utils/format';
import { createInitialAppStoreState, createSeededChallengeState } from './appStore.defaults';
import { buildChallengeStateFromLegacy, createActiveChallenge } from './challengeState';
import {
  buildInviteCode,
  getDateProposals,
  partnerIds,
  resolveAgendaStatus,
  uniquePartners,
} from './appStore.helpers';
import type { ChallengeGoal } from '../types/plan';
import type { AppState, AppStoreState } from './appStore.types';

type LegacyPersistedState = Partial<AppStoreState> & {
  challengeGoal?: ChallengeGoal;
};

export const migrateAppStore = (persistedState: unknown, persistedVersion = 0) => {
  const state = persistedState as LegacyPersistedState;
  const memories = state.memories ?? [];
  const migratedState = state.activeChallenge
    ? state
    : {
        ...state,
        ...buildChallengeStateFromLegacy(
          memories,
          [10, 20, 30].includes(state.challengeGoal ?? 0)
            ? state.challengeGoal as ChallengeGoal
            : 30,
        ),
        pendingCelebrationChallengeId: undefined,
      };
  const isOriginalDemoState =
    persistedVersion < 4 &&
    memories.length === 1 &&
    memories[0]?.id === 'memory_seed_001' &&
    (migratedState.completedChallenges?.length ?? 0) === 0;

  return isOriginalDemoState
    ? { ...migratedState, ...createSeededChallengeState() }
    : migratedState;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...createInitialAppStoreState(),
      completeOnboarding: (preferences) =>
        set({
          onboardingCompleted: true,
          preferences,
        }),
      saveMemory: (memory) =>
        set((state) => {
          const alreadyExists = state.memories.some((item) => item.id === memory.id);
          const nextAgendaItems = state.agendaItems.map((item) =>
            item.planId === memory.planId && item.status !== 'cancelled'
              ? {
                  ...item,
                  status: 'completed' as const,
                  updatedAt: getNowIso(),
                }
              : item,
          );
          if (alreadyExists) {
            return {
              memories: state.memories.map((item) => (item.id === memory.id ? memory : item)),
              agendaItems: nextAgendaItems,
            };
          }

          const nextChallengeMemoryIds = [...state.activeChallenge.memoryIds, memory.id];
          const challengeCompleted = nextChallengeMemoryIds.length >= state.activeChallenge.goal;
          const completedChallenge = challengeCompleted
            ? {
                ...state.activeChallenge,
                memoryIds: nextChallengeMemoryIds,
                completedAt: memory.createdAt,
              }
            : undefined;

          return {
            memories: alreadyExists
              ? state.memories.map((item) => (item.id === memory.id ? memory : item))
              : [memory, ...state.memories],
            agendaItems: nextAgendaItems,
            activeChallenge: challengeCompleted
              ? createActiveChallenge(state.activeChallenge.goal, [], memory.createdAt)
              : { ...state.activeChallenge, memoryIds: nextChallengeMemoryIds },
            completedChallenges: completedChallenge
              ? [completedChallenge, ...state.completedChallenges]
              : state.completedChallenges,
            pendingCelebrationChallengeId:
              completedChallenge?.id ?? state.pendingCelebrationChallengeId,
          };
        }),
      updateReminderSettings: (settings) =>
        set({
          reminderSettings: settings,
        }),
      updatePreferences: (preferences) =>
        set({
          preferences,
        }),
      setChallengeGoal: (goal) =>
        set((state) =>
          goal < state.activeChallenge.memoryIds.length
            ? state
            : {
                activeChallenge: {
                  ...state.activeChallenge,
                  goal,
                },
              },
        ),
      dismissChallengeCelebration: () => set({ pendingCelebrationChallengeId: undefined }),
      addCustomPlan: (idea, makeNext = false) => {
        const planId = `custom_${createId()}`;
        set((state) => {
          const plan = {
            ...createCustomPlan(idea, state.currentPartnerId),
            id: planId,
          };
          const now = getNowIso();
          const requiresBoth = state.partnerInviteStatus === 'linked';
          const nextAgendaItems = makeNext
            ? [
                ...state.agendaItems,
                resolveAgendaStatus({
                  id: createId(),
                  planId,
                  status: 'pending_agreement',
                  planAcceptedBy: [state.currentPartnerId],
                  dateAcceptedBy: [],
                  createdByPartnerId: state.currentPartnerId,
                  createdAt: now,
                  updatedAt: now,
                }, requiresBoth),
              ]
            : state.agendaItems;
          return {
            customPlans: [plan, ...state.customPlans],
            agendaItems: nextAgendaItems,
          };
        });
        return planId;
      },
      updateCustomPlan: (planId, updates) =>
        set((state) => ({
          customPlans: state.customPlans.map((plan) =>
            plan.id === planId && plan.isCustom
              ? {
                  ...plan,
                  ...updates,
                  updatedAt: getNowIso(),
                }
              : plan,
          ),
        })),
      proposeAgendaPlan: (planId) => {
        const agendaItemId = createId();
        set((state) => {
          const now = getNowIso();
          const requiresBoth = state.partnerInviteStatus === 'linked';
          const existingItem = state.agendaItems.find(
            (item) =>
              item.planId === planId &&
              item.status !== 'completed' &&
              item.status !== 'cancelled',
          );

          const nextAgendaItems = existingItem
            ? state.agendaItems.map((item) =>
                item.id === existingItem.id
                  ? resolveAgendaStatus(
                      {
                        ...item,
                        planAcceptedBy: uniquePartners([
                          ...item.planAcceptedBy,
                          state.currentPartnerId,
                        ]),
                        updatedAt: now,
                      },
                      requiresBoth,
                    )
                  : item,
              )
            : [
                ...state.agendaItems,
                resolveAgendaStatus(
                  {
                    id: agendaItemId,
                    planId,
                    status: 'pending_agreement',
                    planAcceptedBy: [state.currentPartnerId],
                    dateAcceptedBy: [],
                    createdByPartnerId: state.currentPartnerId,
                    createdAt: now,
                    updatedAt: now,
                  },
                  requiresBoth,
                ),
              ];

          return {
            agendaItems: nextAgendaItems,
          };
        });
        return agendaItemId;
      },
      acceptAgendaPlan: (agendaItemId) =>
        set((state) => {
          const requiresBoth = state.partnerInviteStatus === 'linked';
          const nextAgendaItems = state.agendaItems.map((item) =>
            item.id === agendaItemId
              ? resolveAgendaStatus(
                  {
                    ...item,
                    planAcceptedBy: uniquePartners([
                      ...item.planAcceptedBy,
                      state.currentPartnerId,
                    ]),
                    updatedAt: getNowIso(),
                  },
                  requiresBoth,
                )
              : item,
          );

          return {
            agendaItems: nextAgendaItems,
          };
        }),
      setAgendaDate: (agendaItemId, date) =>
        set((state) => {
          const requiresBoth = state.partnerInviteStatus === 'linked';
          const nextAgendaItems = state.agendaItems.map((item) => {
            if (item.id !== agendaItemId) return item;

            const dateProposals = getDateProposals(item);
            if (date) {
              dateProposals[state.currentPartnerId] = date;
            } else {
              delete dateProposals[state.currentPartnerId];
            }

            const nextDate = date || Object.values(dateProposals).filter(Boolean)[0];

            return resolveAgendaStatus(
              {
                ...item,
                date: nextDate,
                dateProposals,
                dateAcceptedBy: date ? [state.currentPartnerId] : [],
                updatedAt: getNowIso(),
              },
              requiresBoth,
            );
          });

          return {
            agendaItems: nextAgendaItems,
          };
        }),
      acceptAgendaDate: (agendaItemId, acceptedDate) =>
        set((state) => {
          const requiresBoth = state.partnerInviteStatus === 'linked';
          const nextAgendaItems = state.agendaItems.map((item) =>
            item.id === agendaItemId && (acceptedDate || item.date)
              ? resolveAgendaStatus(
                  {
                    ...item,
                    date: acceptedDate ?? item.date,
                    dateAcceptedBy: uniquePartners([
                      ...partnerIds.filter(
                        (partnerId) =>
                          getDateProposals(item)[partnerId] === (acceptedDate ?? item.date),
                      ),
                      state.currentPartnerId,
                    ]),
                    updatedAt: getNowIso(),
                  },
                  requiresBoth,
                )
              : item,
          );

          return {
            agendaItems: nextAgendaItems,
          };
        }),
      cancelAgendaItem: (agendaItemId) =>
        set((state) => ({
          agendaItems: state.agendaItems.map((item) =>
            item.id === agendaItemId
              ? {
                  ...item,
                  status: 'cancelled' as const,
                  updatedAt: getNowIso(),
                }
              : item,
          ),
        })),
      completeAgendaItemByPlan: (planId) =>
        set((state) => {
          const nextAgendaItems = state.agendaItems.map((item) =>
            item.planId === planId && item.status === 'confirmed'
              ? {
                  ...item,
                  status: 'completed' as const,
                  updatedAt: getNowIso(),
                }
              : item,
          );

          return {
            agendaItems: nextAgendaItems,
          };
        }),
      setCurrentPartner: (partnerId) =>
        set({
          currentPartnerId: partnerId,
        }),
      markPartnerLinked: () =>
        set((state) => ({
          partnerInviteStatus: 'linked',
          agendaItems: state.agendaItems.map((item) => resolveAgendaStatus(item, true)),
        })),
      setPartnerLinked: (linked) =>
        set((state) => ({
          partnerInviteStatus: linked ? 'linked' : 'ready',
          agendaItems: state.agendaItems.map((item) => resolveAgendaStatus(item, linked)),
          redeemedInviteCode: linked ? state.redeemedInviteCode : undefined,
        })),
      setPairModeEnabled: (enabled) =>
        set({
          individualModePromoDismissed: !enabled,
        }),
      redeemInviteCode: (rawCode, options) => {
        let result: { ok: boolean; message?: string } = { ok: true };

        set((state) => {
          const validation = validateInviteCodeInput(rawCode, state.inviteCode);
          if (!validation.ok) {
            result = { ok: false, message: validation.message };
            return state;
          }

          return {
            partnerInviteStatus: 'linked' as const,
            currentPartnerId: options?.partnerId ?? ('partner_two' as const),
            individualModePromoDismissed: false,
            redeemedInviteCode: validation.normalizedCode,
            onboardingCompleted: true,
            preferences: options?.payload?.preferences ?? state.preferences,
            agendaItems: state.agendaItems.map((item) => resolveAgendaStatus(item, true)),
          };
        });

        return result;
      },
      dismissIndividualModePromo: () =>
        set({
          individualModePromoDismissed: true,
        }),
      showIndividualModePromo: () =>
        set({
          individualModePromoDismissed: false,
        }),
      signOut: () =>
        set(createInitialAppStoreState()),
    }),
    {
      name: 'planes-pareja-store',
      version: 4,
      migrate: migrateAppStore,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        onboardingCompleted: state.onboardingCompleted,
        preferences: state.preferences,
        activeChallenge: state.activeChallenge,
        completedChallenges: state.completedChallenges,
        pendingCelebrationChallengeId: state.pendingCelebrationChallengeId,
        plansUnlocked: state.plansUnlocked,
        memories: state.memories,
        reminderSettings: state.reminderSettings,
        customPlans: state.customPlans,
        agendaItems: state.agendaItems,
        currentPartnerId: state.currentPartnerId,
        inviteCode: state.inviteCode,
        partnerInviteStatus: state.partnerInviteStatus,
        individualModePromoDismissed: state.individualModePromoDismissed,
        redeemedInviteCode: state.redeemedInviteCode,
      }),
    },
  ),
);
