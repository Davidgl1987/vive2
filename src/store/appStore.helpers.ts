import type { AgendaItem, PartnerId } from '../types/plan';
import { createId } from '../utils/id';

export const buildInviteCode = () =>
  `VIVE2-${createId().replace(/-/g, '').slice(0, 6).toUpperCase()}`;

export const partnerIds: PartnerId[] = ['partner_one', 'partner_two'];

export const uniquePartners = (partners: PartnerId[]) => [...new Set(partners)];

export const isAcceptedByBoth = (partners: PartnerId[]) =>
  partnerIds.every((partnerId) => partners.includes(partnerId));

export const isAcceptedEnough = (partners: PartnerId[], requiresBoth: boolean) =>
  requiresBoth ? isAcceptedByBoth(partners) : partners.length > 0;

export const resolveAgendaStatus = (item: AgendaItem, requiresBoth = true): AgendaItem => {
  if (item.status === 'completed' || item.status === 'cancelled') return item;

  const confirmed =
    Boolean(item.date) &&
    isAcceptedEnough(item.planAcceptedBy, requiresBoth) &&
    isAcceptedEnough(item.dateAcceptedBy, requiresBoth);

  return {
    ...item,
    status: confirmed ? 'confirmed' : 'pending_agreement',
  };
};

export const getDateProposals = (item: AgendaItem): Partial<Record<PartnerId, string>> => ({
  ...(item.date ? { [item.dateAcceptedBy[0] ?? item.createdByPartnerId]: item.date } : {}),
  ...(item.dateProposals ?? {}),
});
