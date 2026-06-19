import { beforeEach, describe, expect, it } from 'vitest';
import type { CompletedPlan } from '../types/memory';
import { createInitialAppStoreState } from './appStore.defaults';
import { migrateAppStore, useAppStore } from './useAppStore';

const resetStore = () => {
  localStorage.clear();
  useAppStore.setState(createInitialAppStoreState());
};

const buildMemory = (index: number): CompletedPlan => ({
  id: `memory_test_${index}`,
  coupleId: useAppStore.getState().coupleId,
  planId: `plan_${String(index + 1).padStart(3, '0')}`,
  planTitle: `Plan ${index}`,
  date: `2026-07-${String(index + 1).padStart(2, '0')}`,
  photos: [],
  note: 'Test',
  rating: 5,
  sharedCount: 0,
  createdAt: `2026-07-${String(index + 1).padStart(2, '0')}T18:00:00.000Z`,
  updatedAt: `2026-07-${String(index + 1).padStart(2, '0')}T18:00:00.000Z`,
});

describe('useAppStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('completes onboarding and updates preferences', () => {
    const nextPreferences = {
      ...useAppStore.getState().preferences,
      coupleName: 'Ana y Luis',
      partnerOneName: 'Ana',
      partnerTwoName: 'Luis',
    };

    useAppStore.getState().completeOnboarding(nextPreferences);

    const state = useAppStore.getState();
    expect(state.onboardingCompleted).toBe(true);
    expect(state.preferences.coupleName).toBe('Ana y Luis');
    expect(state.preferences.partnerOneName).toBe('Ana');
  });

  it('updates and persists the challenge goal', () => {
    useAppStore.getState().setChallengeGoal(10);

    const persistedState = JSON.parse(localStorage.getItem('planes-pareja-store') ?? '{}');
    expect(useAppStore.getState().activeChallenge.goal).toBe(10);
    expect(persistedState.state.activeChallenge.goal).toBe(10);
  });

  it('does not allow a goal below the current challenge progress', () => {
    useAppStore.setState((state) => ({
      activeChallenge: {
        ...state.activeChallenge,
        goal: 20,
        memoryIds: Array.from({ length: 15 }, (_, index) => `memory_${index}`),
      },
    }));

    useAppStore.getState().setChallengeGoal(10);
    expect(useAppStore.getState().activeChallenge.goal).toBe(20);

    useAppStore.getState().setChallengeGoal(30);
    expect(useAppStore.getState().activeChallenge.goal).toBe(30);
  });

  it('archives a completed challenge and starts the next one automatically', () => {
    const initialCompletedChallenges = useAppStore.getState().completedChallenges.length;
    useAppStore.getState().setChallengeGoal(10);

    for (let index = 1; index <= 10; index += 1) {
      useAppStore.getState().saveMemory(buildMemory(index));
    }

    const state = useAppStore.getState();
    expect(state.completedChallenges).toHaveLength(initialCompletedChallenges + 1);
    expect(state.completedChallenges[0]?.memoryIds).toHaveLength(10);
    expect(state.activeChallenge.goal).toBe(10);
    expect(state.activeChallenge.memoryIds).toHaveLength(0);
    expect(state.pendingCelebrationChallengeId).toBe(state.completedChallenges[0]?.id);

    state.dismissChallengeCelebration();
    expect(useAppStore.getState().pendingCelebrationChallengeId).toBeUndefined();
  });

  it('does not count an edited memory twice in the active challenge', () => {
    const memory = buildMemory(1);
    useAppStore.getState().saveMemory(memory);
    const countAfterCreate = useAppStore.getState().activeChallenge.memoryIds.length;

    useAppStore.getState().saveMemory({ ...memory, note: 'Editado' });

    expect(useAppStore.getState().activeChallenge.memoryIds).toHaveLength(countAfterCreate);
    expect(useAppStore.getState().memories.find((item) => item.id === memory.id)?.note).toBe('Editado');
  });

  it('migrates legacy memories into completed and active challenge cycles', () => {
    const memories = Array.from({ length: 15 }, (_, index) => buildMemory(index + 1));
    const migrated = migrateAppStore({ memories, challengeGoal: 10 }) as ReturnType<
      typeof createInitialAppStoreState
    >;

    expect(migrated.completedChallenges).toHaveLength(1);
    expect(migrated.completedChallenges[0]?.memoryIds).toHaveLength(10);
    expect(migrated.activeChallenge.memoryIds).toHaveLength(5);
    expect(migrated.pendingCelebrationChallengeId).toBeUndefined();
  });

  it('removes historical demo data without deleting user memories', () => {
    const seedMemory = { ...buildMemory(1), id: 'memory_seed_001' };
    const userMemory = buildMemory(2);
    const migrated = migrateAppStore({
      onboardingCompleted: false,
      preferences: {
        coupleName: 'Cris y David',
        partnerOneName: 'Cris',
        partnerTwoName: 'David',
      },
      memories: [seedMemory, userMemory],
      activeChallenge: {
        id: 'challenge_original',
        goal: 30,
        memoryIds: [seedMemory.id, userMemory.id],
        startedAt: seedMemory.createdAt,
      },
      completedChallenges: [{
        id: 'challenge_seed_completed_001',
        goal: 10,
        memoryIds: [seedMemory.id],
        startedAt: seedMemory.createdAt,
        completedAt: seedMemory.updatedAt,
      }],
      pendingCelebrationChallengeId: 'challenge_seed_completed_001',
    }, 4) as ReturnType<typeof createInitialAppStoreState>;

    expect(migrated.memories.map((memory) => memory.id)).toEqual([userMemory.id]);
    expect(migrated.completedChallenges).toHaveLength(0);
    expect(migrated.activeChallenge.memoryIds).toEqual([userMemory.id]);
    expect(migrated.pendingCelebrationChallengeId).toBeUndefined();
    expect(migrated.preferences).toEqual({
      coupleName: '',
      partnerOneName: '',
      partnerTwoName: '',
    });
  });

  it('moves an agenda item to confirmed when both partners accept plan and date', () => {
    const { proposeAgendaPlan, setCurrentPartner, acceptAgendaPlan, setAgendaDate, acceptAgendaDate } =
      useAppStore.getState();

    useAppStore.getState().setPartnerLinked(true);

    const agendaItemId = proposeAgendaPlan('plan_001');
    setCurrentPartner('partner_two');
    acceptAgendaPlan(agendaItemId);
    setAgendaDate(agendaItemId, '2026-07-01');
    setCurrentPartner('partner_one');
    acceptAgendaDate(agendaItemId, '2026-07-01');

    const agendaItem = useAppStore.getState().agendaItems.find((item) => item.id === agendaItemId);
    expect(agendaItem).toBeDefined();
    expect(agendaItem?.status).toBe('confirmed');
    expect(agendaItem?.dateAcceptedBy).toEqual(['partner_two', 'partner_one']);
  });

  it('marks matching agenda items as completed when saving a memory', () => {
    const state = useAppStore.getState();
    state.proposeAgendaPlan('plan_001');
    const agendaItemId = useAppStore.getState().agendaItems[0]?.id;
    useAppStore.setState({
      agendaItems: useAppStore.getState().agendaItems.map((item) =>
        item.id === agendaItemId
          ? { ...item, status: 'confirmed', date: '2026-07-10', dateAcceptedBy: ['partner_one'] }
          : item,
      ),
    });

    const memory: CompletedPlan = {
      id: 'memory_test_001',
      coupleId: useAppStore.getState().coupleId,
      planId: 'plan_001',
      planTitle: 'Picnic bajo las estrellas',
      date: '2026-07-10T18:00:00.000Z',
      photos: [],
      note: 'Test',
      rating: 5,
      sharedCount: 0,
      createdAt: '2026-07-10T18:00:00.000Z',
      updatedAt: '2026-07-10T18:00:00.000Z',
    };

    useAppStore.getState().saveMemory(memory);

    const updatedAgendaItem = useAppStore.getState().agendaItems.find((item) => item.id === agendaItemId);
    expect(useAppStore.getState().memories[0]?.id).toBe('memory_test_001');
    expect(updatedAgendaItem?.status).toBe('completed');
  });

  it('restores the initial app state on sign out', () => {
    const state = useAppStore.getState();
    state.completeOnboarding(state.preferences);
    state.addCustomPlan('Ir al teatro');
    state.proposeAgendaPlan('plan_002');
    state.setPairModeEnabled(false);

    useAppStore.getState().signOut();

    const nextState = useAppStore.getState();
    expect(nextState.onboardingCompleted).toBe(false);
    expect(nextState.activeChallenge.goal).toBe(30);
    expect(nextState.activeChallenge.memoryIds).toHaveLength(0);
    expect(nextState.completedChallenges).toHaveLength(0);
    expect(nextState.memories).toHaveLength(0);
    expect(nextState.preferences.partnerOneName).toBe('');
    expect(nextState.reminderSettings.enabled).toBe(false);
    expect(nextState.customPlans).toHaveLength(0);
    expect(nextState.agendaItems).toHaveLength(0);
    expect(nextState.individualModePromoDismissed).toBe(false);
  });
});
