import { Link } from 'react-router-dom';
import { useState } from 'react';
import { interpolate, messages } from '../../i18n';
import type { AgendaItem, CouplePreferences, PartnerId } from '../../types/plan';
import { formatMonthDay, getTodayDateInput } from '../../utils/format';
import { getAgendaNextAction } from '../../utils/agenda';
import { getPartnerName } from '../../utils/planStatus';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

const secondaryActionClass =
  'inline-flex items-center justify-center rounded-full border-2 border-ink/10 bg-eggshell px-4 py-3 text-sm font-semibold text-ink shadow-[0_8px_0_rgb(var(--color-overlay)/0.04)] transition hover:border-primary/35 hover:bg-primarySoft';

const proposalTone = (partnerId: PartnerId, selected: boolean) => {
  if (partnerId === 'partner_one') {
    return {
      card: selected
        ? 'border-[rgb(var(--partner-one-primary)/0.58)] bg-[rgb(var(--partner-one-primary-soft))]'
        : 'border-[rgb(var(--partner-one-primary)/0.26)] bg-[rgb(var(--partner-one-primary)/0.10)]',
      label: 'text-[rgb(var(--partner-one-primary-dark))]',
      button:
        'bg-[rgb(var(--partner-one-primary-dark))] text-surface shadow-[0_8px_18px_rgb(var(--partner-one-primary-dark)/0.22)]',
      disabledButton:
        'bg-surface/75 text-mist shadow-[inset_0_0_0_1px_rgb(var(--color-text)/0.08)]',
    };
  }

  return {
    card: selected
      ? 'border-[rgb(var(--partner-two-primary)/0.68)] bg-[rgb(var(--partner-two-primary-soft))]'
      : 'border-[rgb(var(--partner-two-primary)/0.32)] bg-[rgb(var(--partner-two-primary)/0.13)]',
    label: 'text-[rgb(var(--partner-two-primary-dark))]',
    button:
      'bg-[rgb(var(--partner-two-primary-dark))] text-surface shadow-[0_8px_18px_rgb(var(--partner-two-primary-dark)/0.2)]',
    disabledButton:
      'bg-surface/75 text-mist shadow-[inset_0_0_0_1px_rgb(var(--color-text)/0.08)]',
  };
};

export const AgendaAgreementCard = ({
  item,
  planTitle,
  preferences,
  currentPartnerId,
  showPlanLink = true,
  onAcceptPlan,
  onAcceptDate,
  onSetDate,
  onCancel,
  confirmedDates = [],
}: {
  item: AgendaItem;
  planTitle: string;
  preferences: CouplePreferences;
  currentPartnerId: PartnerId;
  showPlanLink?: boolean;
  onAcceptPlan: (agendaItemId: string) => void;
  onAcceptDate: (agendaItemId: string, date?: string) => void;
  onSetDate: (agendaItemId: string, date: string) => void;
  onCancel: (agendaItemId: string) => void;
  confirmedDates?: { agendaItemId: string; date: string; planTitle: string }[];
}) => {
  const [matchingDate, setMatchingDate] = useState<string | null>(null);
  const todayDate = getTodayDateInput();
  const creatorName = getPartnerName(preferences, item.createdByPartnerId);
  const nextAction = getAgendaNextAction(item, currentPartnerId);
  const partnerIds: PartnerId[] = ['partner_one', 'partner_two'];
  const proposals = partnerIds
    .map((partnerId) => ({
      partnerId,
      partnerName: getPartnerName(preferences, partnerId),
      date: item.dateProposals?.[partnerId],
    }))
    .filter((proposal): proposal is { partnerId: PartnerId; partnerName: string; date: string } =>
      Boolean(proposal.date),
    );
  const visibleProposals =
    proposals.length > 0
      ? proposals
      : item.date
        ? [{
            partnerId: item.dateAcceptedBy[0] ?? item.createdByPartnerId,
            partnerName: getPartnerName(preferences, item.dateAcceptedBy[0] ?? item.createdByPartnerId),
            date: item.date,
          }]
        : [];
  const actionCopy = {
    accept_plan: {
      title: messages.components.agendaAgreementCard.acceptPlanTitle,
      description: interpolate(messages.components.agendaAgreementCard.acceptPlanDescription, {
        name: creatorName,
      }),
    },
    choose_date: {
      title: messages.components.agendaAgreementCard.chooseDateTitle,
      description: visibleProposals.length > 0
        ? messages.components.agendaAgreementCard.chooseDateDescriptionWithProposals
        : messages.components.agendaAgreementCard.chooseDateDescriptionWithoutProposals,
    },
    confirm_date: {
      title: messages.components.agendaAgreementCard.confirmDateTitle,
      description: messages.components.agendaAgreementCard.confirmDateDescription,
    },
    ready: {
      title: messages.components.agendaAgreementCard.readyTitle,
      description: messages.components.agendaAgreementCard.readyDescription,
    },
  }[nextAction];
  const otherPartnerProposal = visibleProposals.find(
    (proposal) => proposal.partnerId !== currentPartnerId,
  );
  const currentConflict = item.date
    ? confirmedDates.find(
        (confirmedDate) =>
          confirmedDate.agendaItemId !== item.id && confirmedDate.date === item.date,
      )
    : undefined;

  const handleDateInput = (date: string) => {
    if (!date) return;
    if (otherPartnerProposal?.date === date) {
      setMatchingDate(date);
      return;
    }
    onSetDate(item.id, date);
  };

  const handleAcceptMatchingDate = () => {
    if (!matchingDate) return;
    onAcceptDate(item.id, matchingDate);
    setMatchingDate(null);
  };

  return (
    <>
    <Card className="space-y-3 !p-4">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blushDark">
          {interpolate(messages.components.agendaAgreementCard.proposedBy, { name: creatorName })}
        </p>
        {showPlanLink ? (
          <Link
            className="mt-2 block text-xl font-extrabold leading-tight text-ink transition hover:text-blushDark"
            to={`/plans/${item.planId}`}
          >
            {planTitle}
          </Link>
        ) : (
          <h2 className="mt-2 text-xl font-extrabold leading-tight text-ink">{planTitle}</h2>
        )}
      </div>

      {visibleProposals.length === 0 || nextAction === 'accept_plan' ? (
      <div className="rounded-[18px] bg-gradient-to-br from-eggshell to-primarySoft p-3">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blushDark">
          {messages.components.agendaAgreementCard.nextStep}
        </p>
        <h3 className="mt-1 text-lg font-extrabold text-ink">{actionCopy.title}</h3>
        <p className="mt-1 text-sm leading-6 text-mist">{actionCopy.description}</p>
      </div>
      ) : null}

      {nextAction === 'accept_plan' ? (
        <Button type="button" onClick={() => onAcceptPlan(item.id)}>
          {messages.components.agendaAgreementCard.acceptPlan}
        </Button>
      ) : null}

      {visibleProposals.length > 0 && nextAction !== 'accept_plan' ? (
        <div className="space-y-2">
          <p className="text-sm font-extrabold text-ink">{messages.components.agendaAgreementCard.chooseDate}</p>
          {currentConflict ? (
            <div className="rounded-[16px] border-2 border-warning/25 bg-eggshell px-3 py-2 text-xs font-semibold leading-5 text-mist">
              {interpolate(messages.components.agendaAgreementCard.dateConflict, {
                date: formatMonthDay(currentConflict.date, messages.common.emptyDate),
                planTitle: currentConflict.planTitle,
              })}
            </div>
          ) : null}
          <div className={visibleProposals.length > 1 ? 'grid grid-cols-2 gap-2' : 'grid gap-2'}>
            {visibleProposals.map((proposal) => {
              const selected = item.date === proposal.date;
              const ownProposal = proposal.partnerId === currentPartnerId;
              const acceptedByCurrent =
                selected && item.dateAcceptedBy.includes(currentPartnerId);
              const tone = proposalTone(proposal.partnerId, selected);

              return (
                <div
                  key={`${proposal.partnerId}-${proposal.date}`}
                  className={`rounded-[16px] border-2 p-2.5 ${tone.card}`}
                >
                  <p className={`truncate text-[9px] font-extrabold uppercase tracking-[0.14em] ${tone.label}`}>
                    {interpolate(messages.components.agendaAgreementCard.partnerProposes, {
                      name: proposal.partnerName,
                    })}
                  </p>
                  <p className="mt-1 font-heading text-[1.12rem] font-bold leading-none text-ink">
                    {formatMonthDay(proposal.date, messages.common.emptyDate)}
                  </p>
                  <button
                    className={`mt-2 min-h-8 w-full rounded-full px-2 py-1.5 text-[11px] font-semibold leading-tight transition ${
                      ownProposal || acceptedByCurrent
                        ? tone.disabledButton
                        : tone.button
                    }`}
                    type="button"
                    disabled={ownProposal || acceptedByCurrent}
                    onClick={() => onAcceptDate(item.id, proposal.date)}
                  >
                    {ownProposal
                      ? messages.components.agendaAgreementCard.yourProposal
                      : acceptedByCurrent
                        ? messages.components.agendaAgreementCard.accepted
                        : messages.components.agendaAgreementCard.accept}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {nextAction !== 'accept_plan' ? (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">
            {visibleProposals.length > 0
              ? messages.components.agendaAgreementCard.proposeAnotherDate
              : messages.components.agendaAgreementCard.pickDate}
          </span>
          <input
            className="field !py-3"
            type="date"
            min={todayDate}
            value=""
            onChange={(event) => handleDateInput(event.target.value)}
          />
        </label>
      ) : null}

      <div className={showPlanLink ? 'grid grid-cols-2 gap-2' : 'grid'}>
        {showPlanLink ? (
          <Link
            className={secondaryActionClass}
            to={`/plans/${item.planId}`}
          >
            {messages.components.agendaAgreementCard.viewPlan}
          </Link>
        ) : null}
        <button
          className={secondaryActionClass}
          type="button"
          onClick={() => onCancel(item.id)}
        >
          {messages.common.actions.cancel}
        </button>
      </div>
    </Card>
    <Modal open={Boolean(matchingDate)}>
      <div className="solid-card rounded-[28px] p-5 shadow-soft">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blushDark">
          {messages.components.agendaAgreementCard.sameDateEyebrow}
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold leading-tight text-ink">
          {interpolate(messages.components.agendaAgreementCard.sameDateTitle, {
            name: otherPartnerProposal?.partnerName ?? '',
          })}
        </h2>
        <p className="mt-3 text-sm leading-6 text-mist">
          {messages.components.agendaAgreementCard.sameDateDescription}
        </p>
        <div className="mt-5 grid gap-3">
          <Button type="button" onClick={handleAcceptMatchingDate}>
            {messages.components.agendaAgreementCard.sameDateConfirm}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setMatchingDate(null)}>
            {messages.components.agendaAgreementCard.proposeAnotherDate}
          </Button>
        </div>
      </div>
    </Modal>
    </>
  );
};
