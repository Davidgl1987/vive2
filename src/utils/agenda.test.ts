import { describe, expect, it } from 'vitest';
import type { AgendaItem } from '../types/plan';
import {
  getAgendaNextAction,
  getConfirmedAgendaItems,
  getNextAgendaItem,
  getPendingAgendaItems,
  hasConfirmedPlanOnDate,
} from './agenda';

const agendaItems: AgendaItem[] = [
  {
    id: 'agenda_002',
    planId: 'plan_002',
    date: '2026-08-02',
    status: 'confirmed',
    planAcceptedBy: ['partner_one', 'partner_two'],
    dateAcceptedBy: ['partner_one', 'partner_two'],
    createdByPartnerId: 'partner_one',
    createdAt: '2026-06-01T12:00:00.000Z',
    updatedAt: '2026-06-01T12:00:00.000Z',
  },
  {
    id: 'agenda_001',
    planId: 'plan_001',
    date: '2026-07-01',
    status: 'confirmed',
    planAcceptedBy: ['partner_one', 'partner_two'],
    dateAcceptedBy: ['partner_one', 'partner_two'],
    createdByPartnerId: 'partner_one',
    createdAt: '2026-05-01T12:00:00.000Z',
    updatedAt: '2026-05-01T12:00:00.000Z',
  },
  {
    id: 'agenda_003',
    planId: 'plan_003',
    status: 'pending_agreement',
    planAcceptedBy: ['partner_one'],
    dateAcceptedBy: [],
    createdByPartnerId: 'partner_one',
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
];

describe('agenda utils', () => {
  it('returns confirmed items sorted by date and the nearest next item', () => {
    const confirmed = getConfirmedAgendaItems(agendaItems);

    expect(confirmed.map((item) => item.id)).toEqual(['agenda_001', 'agenda_002']);
    expect(getNextAgendaItem(agendaItems)?.id).toBe('agenda_001');
  });

  it('returns pending items sorted by creation date', () => {
    expect(getPendingAgendaItems(agendaItems).map((item) => item.id)).toEqual(['agenda_003']);
  });

  it('resolves the next action based on agreement state', () => {
    expect(getAgendaNextAction(agendaItems[2], 'partner_two')).toBe('accept_plan');
    expect(getAgendaNextAction({ ...agendaItems[2], planAcceptedBy: ['partner_one', 'partner_two'] }, 'partner_one')).toBe('choose_date');
    expect(
      getAgendaNextAction(
        {
          ...agendaItems[2],
          planAcceptedBy: ['partner_one', 'partner_two'],
          date: '2026-09-01',
        },
        'partner_one',
      ),
    ).toBe('confirm_date');
    expect(getAgendaNextAction(agendaItems[0], 'partner_one')).toBe('ready');
  });

  it('detects whether a date already has a confirmed plan', () => {
    expect(hasConfirmedPlanOnDate(agendaItems, '2026-07-01')).toBe(true);
    expect(hasConfirmedPlanOnDate(agendaItems, '2026-07-02')).toBe(false);
  });
});
