import type { AgendaItem, PartnerId } from '../types/plan';

export type AgendaNextAction = 'accept_plan' | 'choose_date' | 'confirm_date' | 'ready';

export const getConfirmedAgendaItems = (items: AgendaItem[]) =>
  items
    .filter((item) => item.status === 'confirmed' && item.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

export const getNextAgendaItem = (items: AgendaItem[]) => getConfirmedAgendaItems(items)[0];

export const getPendingAgendaItems = (items: AgendaItem[]) =>
  items
    .filter((item) => item.status === 'pending_agreement')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

export const hasConfirmedPlanOnDate = (items: AgendaItem[], date: string) =>
  items.some((item) => item.status === 'confirmed' && item.date?.slice(0, 10) === date);

export const getAgendaNextAction = (
  item: AgendaItem,
  currentPartnerId: PartnerId,
): AgendaNextAction => {
  if (item.status === 'confirmed') return 'ready';
  if (!item.planAcceptedBy.includes(currentPartnerId)) return 'accept_plan';
  if (!item.date) return 'choose_date';
  if (!item.dateAcceptedBy.includes(currentPartnerId)) return 'confirm_date';
  return 'choose_date';
};
