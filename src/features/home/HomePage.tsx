import { BellRing, CalendarDays, CheckCircle2, HeartHandshake, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmedPlansCalendar } from '../../components/agenda/ConfirmedPlansCalendar';
import { ChallengeProgress } from '../../components/challenge/ChallengeProgress';
import { Card } from '../../components/ui/Card';
import { interpolate, messages } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import {
  getConfirmedAgendaItems,
  getNextAgendaItem,
  getPendingAgendaItems,
  hasConfirmedPlanOnDate,
} from '../../utils/agenda';
import { formatMonthDay, getDateKey } from '../../utils/format';
import { getPartnerName } from '../../utils/planStatus';
import { findPlanById, getAllPlans } from '../../utils/plans';

export const HomePage = () => {
  const navigate = useNavigate();
  const preferences = useAppStore((state) => state.preferences);
  const memories = useAppStore((state) => state.memories);
  const customPlans = useAppStore((state) => state.customPlans);
  const agendaItems = useAppStore((state) => state.agendaItems);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partnerInviteStatus = useAppStore((state) => state.partnerInviteStatus);
  const activeChallenge = useAppStore((state) => state.activeChallenge);
  const allPlans = useMemo(() => getAllPlans(customPlans), [customPlans]);
  const confirmedAgendaItems = getConfirmedAgendaItems(agendaItems);
  const pendingAgendaItems = getPendingAgendaItems(agendaItems);
  const nextAgendaItem = getNextAgendaItem(agendaItems);
  const nextPlan = nextAgendaItem ? findPlanById(customPlans, nextAgendaItem.planId) : undefined;
  const currentPartnerName = getPartnerName(preferences, currentPartnerId);
  const otherPartnerName = getPartnerName(
    preferences,
    currentPartnerId === 'partner_one' ? 'partner_two' : 'partner_one',
  );
  const linked = partnerInviteStatus === 'linked';

  const completedIds = new Set(memories.map((memory) => memory.planId));

  const recommendedPlan = useMemo(() => {
    const unavailableIds = new Set([
      ...memories.map((memory) => memory.planId),
      ...agendaItems
        .filter((item) => item.status !== 'completed' && item.status !== 'cancelled')
        .map((item) => item.planId),
    ]);
    const candidates = allPlans.filter((plan) => !unavailableIds.has(plan.id));
    const pool = candidates.length > 0 ? candidates : allPlans;

    return pool[Math.floor(Math.random() * pool.length)] ?? allPlans[0];
  }, [agendaItems, allPlans, memories]);

  const challengeCompletedCount = activeChallenge.memoryIds.length;
  const challengeGoal = activeChallenge.goal;
  const highlightedPendingItem = pendingAgendaItems[0];
  const highlightedPendingPlan = highlightedPendingItem
    ? findPlanById(customPlans, highlightedPendingItem.planId)
    : undefined;
  const highlightedPendingName = highlightedPendingItem
    ? getPartnerName(preferences, highlightedPendingItem.createdByPartnerId)
    : undefined;
  const currentPartnerNeedsPlanAcceptance = Boolean(
    highlightedPendingItem && !highlightedPendingItem.planAcceptedBy.includes(currentPartnerId),
  );
  const currentPartnerNeedsDate = Boolean(
    highlightedPendingItem &&
      highlightedPendingItem.planAcceptedBy.includes(currentPartnerId) &&
      !highlightedPendingItem.date,
  );
  const currentPartnerNeedsDateAcceptance = Boolean(
    highlightedPendingItem?.date &&
      !highlightedPendingItem.dateAcceptedBy.includes(currentPartnerId),
  );
  const pendingPartnerId = currentPartnerId === 'partner_one' ? 'partner_two' : 'partner_one';
  const pendingPartnerName = highlightedPendingItem
    ? getPartnerName(preferences, pendingPartnerId)
    : undefined;
  const otherPartnerAcceptedPlan = Boolean(
    highlightedPendingItem?.planAcceptedBy.includes(pendingPartnerId),
  );
  const otherPartnerAcceptedDate = Boolean(
    highlightedPendingItem?.dateAcceptedBy.includes(pendingPartnerId),
  );
  const currentPartnerCreatedPlan = highlightedPendingItem?.createdByPartnerId === currentPartnerId;
  const dateProposals = highlightedPendingItem?.dateProposals ?? {};
  const partnerOneDate = dateProposals.partner_one;
  const partnerTwoDate = dateProposals.partner_two;
  const differentDateProposals = Boolean(
    partnerOneDate &&
      partnerTwoDate &&
      partnerOneDate !== partnerTwoDate,
  );
  const pendingHeadline =
    currentPartnerNeedsPlanAcceptance && highlightedPendingName && highlightedPendingPlan
      ? `${highlightedPendingName} ha propuesto ${highlightedPendingPlan.plan}`
      : highlightedPendingPlan && currentPartnerCreatedPlan && !otherPartnerAcceptedPlan
        ? `Has propuesto ${highlightedPendingPlan.plan}`
      : differentDateProposals && highlightedPendingPlan
        ? `${highlightedPendingPlan.plan}: tenéis dos fechas posibles`
      : currentPartnerNeedsDate && highlightedPendingPlan
        ? `${highlightedPendingPlan.plan}: falta elegir fecha`
      : currentPartnerNeedsDateAcceptance && highlightedPendingPlan
          ? `${highlightedPendingPlan.plan}: falta tu respuesta`
          : highlightedPendingPlan && highlightedPendingItem?.date && !otherPartnerAcceptedDate
            ? `${highlightedPendingPlan.plan}: esperando su sí`
            : highlightedPendingPlan
            ? `${highlightedPendingPlan.plan} está casi cerrado`
            : undefined;
  const pendingDescription =
    currentPartnerNeedsPlanAcceptance
      ? 'Si os apetece, aceptad el plan y elegid un día para cerrarlo.'
      : currentPartnerCreatedPlan && !otherPartnerAcceptedPlan
        ? `A ver qué le parece a ${pendingPartnerName}. Si le gusta, le ponéis fecha.`
      : differentDateProposals
        ? 'Habéis propuesto días distintos. En Agenda podéis quedaros con una fecha o plantear otra.'
      : currentPartnerNeedsDate
        ? 'Ya os apetece a los dos. Ahora solo falta ponerle fecha.'
        : currentPartnerNeedsDateAcceptance
          ? 'Hay una fecha propuesta y falta tu sí para dejarlo cerrado.'
          : highlightedPendingItem?.date && !otherPartnerAcceptedDate && pendingPartnerName
            ? `Tu parte está hecha. Falta que ${pendingPartnerName} confirme la fecha para dejarlo cerrado.`
            : 'Aún queda un pequeño paso para dejarlo cerrado.';
  const plannedOrDoneCount = Math.min(
    challengeGoal,
    challengeCompletedCount + confirmedAgendaItems.length,
  );
  const plansLeftToAgree = Math.max(challengeGoal - plannedOrDoneCount, 0);
  const formattedNextDate = nextAgendaItem?.date
    ? formatMonthDay(nextAgendaItem.date, messages.common.emptyDate)
    : undefined;
  const highlightedConfirmedDate =
    getDateKey(nextAgendaItem?.date) || getDateKey(confirmedAgendaItems[0]?.date) || null;

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-surface/80 py-1 pl-1 pr-3 shadow-[0_8px_22px_rgb(var(--color-overlay)/0.08)] backdrop-blur">
          <img alt={messages.common.brandAlt} className="h-7 w-7" src="/logo/vive2-icono-72x72.png" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush">{messages.common.appName}</p>
        </div>
        <h1 className="mt-2 font-heading text-[2.25rem] font-bold leading-none text-ink">
          {interpolate(messages.pages.home.greeting, { name: currentPartnerName })}
          <span className="text-blush"> ♥</span>
        </h1>
        <p className="page-subtitle mt-2">
          {interpolate(messages.pages.home.subtitle, { name: otherPartnerName })}
        </p>
      </header>

      {highlightedPendingItem && highlightedPendingPlan && pendingHeadline ? (
        <Link className="block" to="/agenda">
          <Card className="grid grid-cols-[auto_1fr] items-center gap-3 bg-gradient-to-br from-primarySoft via-surface to-secondarySoft">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-blush text-surface shadow-soft">
              <BellRing size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blushDark">
                {messages.pages.home.pendingEyebrow}
              </p>
              <h2 className="mt-1 truncate text-base font-extrabold text-ink">
                {pendingHeadline}
              </h2>
              <p className="mt-1 text-sm text-mist">{pendingDescription}</p>
            </div>
          </Card>
        </Link>
      ) : null}

      {nextPlan ? (
        <Card className="overflow-hidden bg-gradient-to-br from-surface via-eggshell to-secondarySoft !p-0">
          <Link className="relative block h-52 overflow-hidden" to={`/plans/${nextPlan.id}`}>
            {nextPlan.cover ? (
              <img alt={nextPlan.plan} className="h-full w-full object-cover" src={nextPlan.cover} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primarySoft via-eggshell to-icyAqua px-8 text-center font-heading text-4xl font-bold leading-none text-ink">
                {messages.common.appName}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-overlay/80 via-overlay/20 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-xs font-extrabold text-blushDark shadow-[var(--shadow-card)]">
              <CheckCircle2 size={15} />
              {messages.pages.home.hasPlan}
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-surface">
              <p className="inline-flex items-center gap-2 rounded-full bg-surface/20 px-3 py-1 text-xs font-bold backdrop-blur">
                <CalendarDays size={14} />
                {formattedNextDate ?? messages.pages.home.agreedDate}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold leading-none">{nextPlan.plan}</h2>
            </div>
          </Link>
          <div className="space-y-4 p-5">
            <p className="text-sm leading-6 text-mist">
              {messages.pages.home.nextPlanDescription}
            </p>
            <div className="flex justify-end">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blush px-5 py-3 text-sm font-semibold text-surface shadow-soft"
                to={`/plans/${nextPlan.id}/complete`}
              >
                <Sparkles size={19} />
                {messages.pages.agenda.liveIt}
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Link
          className="solid-card block overflow-hidden rounded-[30px] shadow-soft"
          to={`/plans/${recommendedPlan.id}`}
        >
          <div className="relative h-48">
            {recommendedPlan.cover ? (
              <img
                alt={recommendedPlan.plan}
                className="h-full w-full object-cover"
                src={recommendedPlan.cover}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primarySoft via-eggshell to-icyAqua px-8 text-center font-heading text-4xl font-bold leading-none text-ink">
                {messages.common.appName}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-overlay/75 via-overlay/15 to-transparent" />
            <div className="absolute left-4 top-4 rounded-full bg-surface px-3 py-1 text-xs font-extrabold text-blush shadow-[var(--shadow-card)]">
              {messages.pages.home.recommendedForToday}
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-surface">
              <h2 className="text-2xl font-bold">{recommendedPlan.plan}</h2>
              <p className="mt-2 max-w-[26ch] text-sm text-surface/85">
                {recommendedPlan.descripcion}
              </p>
            </div>
          </div>
        </Link>
      )}

      {confirmedAgendaItems.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <CalendarDays className="text-blushDark" size={18} />
            <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-mist">
              {messages.pages.home.agendaSection}
            </h2>
          </div>
          <ConfirmedPlansCalendar
            items={confirmedAgendaItems}
            selectedDate={highlightedConfirmedDate}
            onSelectDate={(date) =>
              navigate(
                hasConfirmedPlanOnDate(confirmedAgendaItems, date)
                  ? `/agenda?day=${date}`
                  : `/plans?date=${date}`,
              )
            }
          />
        </section>
      ) : null}

      <Link className="block" to="/memories">
        <Card>
          <ChallengeProgress completed={challengeCompletedCount} goal={challengeGoal} />
        </Card>
      </Link>

      <Link className="block" to="/agenda">
        <Card className="space-y-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-mist/70">
            <CalendarDays size={16} />
            {messages.pages.home.agendaSummary}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-eggshell px-4 py-3">
              <p className="text-2xl font-extrabold text-ink">{confirmedAgendaItems.length}</p>
              <p className="text-xs font-bold text-mist">{messages.pages.home.agreedPlans}</p>
            </div>
            <div className="rounded-[18px] bg-primarySoft px-4 py-3">
              <p className="text-2xl font-extrabold text-ink">{plansLeftToAgree}</p>
              <p className="text-xs font-bold text-mist">{messages.pages.home.toAgree}</p>
            </div>
          </div>
          {pendingAgendaItems.length > 0 ? (
            <p className="text-sm font-semibold text-blushDark">
              {interpolate(messages.pages.home.pendingProposals, {
                count: pendingAgendaItems.length,
                suffix: pendingAgendaItems.length === 1 ? '' : 's',
              })}
            </p>
          ) : null}
        </Card>
      </Link>

      {!linked ? (
        <Link className="block" to="/profile">
          <Card className="grid grid-cols-[auto_1fr] items-center gap-3 !p-4">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primarySoft text-blushDark">
              <HeartHandshake size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{messages.pages.home.pairPromoTitle}</p>
              <p className="mt-1 text-xs text-mist">
                {messages.pages.home.pairPromoDescription}
              </p>
            </div>
          </Card>
        </Link>
      ) : null}

    </div>
  );
};
