import type { AgendaItem, CouplePreferences, PartnerId } from '../types/plan';

export const getPartnerName = (preferences: CouplePreferences, partnerId: PartnerId) =>
  partnerId === 'partner_one' ? preferences.partnerOneName : preferences.partnerTwoName;

export const getPlanStatusBadge = ({
  agendaItems,
  planId,
  currentPartnerId,
  preferences,
}: {
  agendaItems: AgendaItem[];
  planId: string;
  currentPartnerId: PartnerId;
  preferences: CouplePreferences;
}) => {
  const agendaItem = agendaItems.find(
    (item) =>
      item.planId === planId &&
      item.status !== 'completed' &&
      item.status !== 'cancelled',
  );

  if (!agendaItem) return undefined;
  if (agendaItem.status === 'confirmed') return 'En agenda';
  if (agendaItem.planAcceptedBy.includes(currentPartnerId)) return 'Lo has propuesto';

  return `Propuesto por ${getPartnerName(preferences, agendaItem.createdByPartnerId)}`;
};
