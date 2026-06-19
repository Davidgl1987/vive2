import { CalendarDays, CheckCircle2, Clock3, HeartHandshake, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AgendaAgreementCard } from '../../components/agenda/AgendaAgreementCard';
import { ConfirmedPlansCalendar } from '../../components/agenda/ConfirmedPlansCalendar';
import { Card } from '../../components/ui/Card';
import { interpolate, messages } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import type { AgendaItem } from '../../types/plan';
import {
  getConfirmedAgendaItems,
  getPendingAgendaItems,
  hasConfirmedPlanOnDate,
} from '../../utils/agenda';
import { formatMonthDay, getDateKey } from '../../utils/format';
import { findPlanById } from '../../utils/plans';

const primaryActionClass =
  'inline-flex items-center justify-center rounded-full bg-blush px-4 py-3 text-sm font-semibold text-surface shadow-soft transition hover:bg-blushDark';

const secondaryActionClass =
  'rounded-full border-2 border-ink/10 bg-eggshell px-4 py-3 text-sm font-semibold text-ink shadow-[0_8px_0_rgb(var(--color-overlay)/0.04)] transition hover:border-primary/35 hover:bg-primarySoft';

export const AgendaPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const customPlans = useAppStore((state) => state.customPlans);
  const agendaItems = useAppStore((state) => state.agendaItems);
  const preferences = useAppStore((state) => state.preferences);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partnerInviteStatus = useAppStore((state) => state.partnerInviteStatus);
  const individualModePromoDismissed = useAppStore((state) => state.individualModePromoDismissed);
  const acceptAgendaPlan = useAppStore((state) => state.acceptAgendaPlan);
  const acceptAgendaDate = useAppStore((state) => state.acceptAgendaDate);
  const setAgendaDate = useAppStore((state) => state.setAgendaDate);
  const cancelAgendaItem = useAppStore((state) => state.cancelAgendaItem);
  const confirmedItems = getConfirmedAgendaItems(agendaItems);
  const pendingItems = getPendingAgendaItems(agendaItems);
  const linked = partnerInviteStatus === 'linked';
  const confirmedItemsSorted = useMemo(
    () =>
      [...confirmedItems].sort((first, second) =>
        getDateKey(first.date).localeCompare(getDateKey(second.date)),
      ),
    [confirmedItems],
  );
  const confirmedItemsByDate = useMemo(() => {
    const grouped = new Map<string, AgendaItem[]>();

    confirmedItemsSorted.forEach((item) => {
      const dateKey = getDateKey(item.date);
      if (!dateKey) return;

      const itemsOnDate = grouped.get(dateKey) ?? [];
      itemsOnDate.push(item);
      grouped.set(dateKey, itemsOnDate);
    });

    return grouped;
  }, [confirmedItemsSorted]);
  const selectedConfirmedDateParam = searchParams.get('day');
  const selectedConfirmedDate =
    selectedConfirmedDateParam && confirmedItemsByDate.has(selectedConfirmedDateParam)
      ? selectedConfirmedDateParam
      : null;
  const visibleConfirmedItems =
    selectedConfirmedDate ? (confirmedItemsByDate.get(selectedConfirmedDate) ?? []) : confirmedItemsSorted;
  const renderPlanTitle = (item: AgendaItem) =>
    findPlanById(customPlans, item.planId)?.plan ?? messages.pages.agenda.pendingPlanFallback;
  const confirmedDates = confirmedItemsSorted.map((item) => ({
    agendaItemId: item.id,
    date: String(item.date),
    planTitle: renderPlanTitle(item),
  }));

  const updateSelectedConfirmedDate = (date: string | null) => {
    const nextParams = new URLSearchParams(searchParams);

    if (date) {
      nextParams.set('day', date);
    } else {
      nextParams.delete('day');
    }

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="space-y-5 pb-4">
      <header className="pt-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blush">Agenda</p>
        <h1 className="mt-2 font-heading text-[2.25rem] font-bold leading-none text-ink">
          {messages.pages.agenda.title}
        </h1>
        <p className="page-subtitle mt-2">
          {messages.pages.agenda.subtitle}
        </p>
      </header>

      {!linked && !individualModePromoDismissed ? (
        <Link className="block" to="/profile">
          <Card className="grid grid-cols-[auto_1fr] items-center gap-3 bg-gradient-to-br from-eggshell via-surface to-secondarySoft">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-surface text-blushDark shadow-[0_8px_22px_rgb(var(--color-overlay)/0.08)]">
              <HeartHandshake size={18} />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blushDark">
                {messages.pages.agenda.pairPromoEyebrow}
              </p>
              <h2 className="mt-1 text-base font-extrabold text-ink">
                {messages.pages.agenda.pairPromoTitle}
              </h2>
              <p className="mt-1 text-sm text-mist">
                {messages.pages.agenda.pairPromoDescription}
              </p>
            </div>
          </Card>
        </Link>
      ) : null}

      <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-blushDark" size={18} />
            <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-mist">
              {messages.pages.agenda.calendar}
            </h2>
          </div>
          <ConfirmedPlansCalendar
            items={confirmedItemsSorted}
            selectedDate={selectedConfirmedDate}
            onSelectDate={(date) => {
              if (!hasConfirmedPlanOnDate(confirmedItemsSorted, date)) {
                navigate(`/plans?date=${date}`);
                return;
              }
              updateSelectedConfirmedDate(selectedConfirmedDate === date ? null : date);
            }}
          />
          <p className="px-1 text-xs font-semibold leading-5 text-mist">
            {messages.pages.agenda.calendarHint}
          </p>
          {confirmedItems.length > 0 ? (
            <>
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-sm font-semibold text-ink">
                {selectedConfirmedDate
                  ? interpolate(messages.pages.agenda.plansOnDate, {
                      date: formatMonthDay(selectedConfirmedDate, messages.common.emptyDate),
                    })
                  : messages.pages.agenda.allConfirmed}
              </p>
              <p className="text-xs text-mist">
                {interpolate(messages.pages.agenda.countLabel, {
                  count: visibleConfirmedItems.length,
                  suffix: visibleConfirmedItems.length === 1 ? '' : 'es',
                })}
              </p>
            </div>
            {selectedConfirmedDate ? (
              <button
                className="text-sm font-semibold text-blush transition hover:text-blushDark"
                type="button"
                onClick={() => updateSelectedConfirmedDate(null)}
              >
                {messages.common.actions.viewAll}
              </button>
            ) : null}
          </div>
          {visibleConfirmedItems.map((item) => {
            const plan = findPlanById(customPlans, item.planId);
            return (
              <Card
                key={item.id}
                className="grid grid-cols-[92px_1fr] gap-0 overflow-hidden !p-0"
              >
                <Link
                  to={`/plans/${item.planId}`}
                  aria-label={interpolate(messages.pages.agenda.viewPlanAria, {
                    title: plan?.plan ?? messages.pages.agenda.pendingPlanFallback,
                  })}
                >
                  {plan?.cover ? (
                    <img alt="" className="h-full min-h-[112px] w-full object-cover" src={plan.cover} />
                  ) : (
                    <div className="min-h-[112px] bg-gradient-to-br from-primarySoft via-eggshell to-icyAqua" />
                  )}
                </Link>
                <div className="space-y-2 p-4">
                  <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-blushDark">
                    <CalendarDays size={14} />
                    {formatMonthDay(item.date, messages.common.emptyDate)}
                  </p>
                  <Link
                    className="block text-lg font-extrabold leading-tight text-ink transition hover:text-blushDark"
                    to={`/plans/${item.planId}`}
                  >
                    {plan?.plan}
                  </Link>
                  <p className="text-sm font-semibold text-mist">{messages.pages.agenda.readyToLive}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      className={primaryActionClass}
                      to={`/plans/${item.planId}/complete`}
                    >
                      {messages.pages.agenda.liveIt}
                    </Link>
                    <button
                      className={secondaryActionClass}
                      type="button"
                      onClick={() => cancelAgendaItem(item.id)}
                    >
                      {messages.pages.agenda.cancelPlan}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
            </>
          ) : null}
        </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock3 className="text-blushDark" size={18} />
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-mist">
            {messages.pages.agenda.pending}
          </h2>
        </div>
        {pendingItems.length > 0 ? (
          pendingItems.map((item) => {
            return (
              <AgendaAgreementCard
                key={item.id}
                currentPartnerId={currentPartnerId}
                item={item}
                planTitle={renderPlanTitle(item)}
                preferences={preferences}
                onAcceptDate={acceptAgendaDate}
                onAcceptPlan={acceptAgendaPlan}
                onCancel={cancelAgendaItem}
                onSetDate={setAgendaDate}
                confirmedDates={confirmedDates}
              />
            );
          })
        ) : (
          <Card className="space-y-4 text-center">
            <Sparkles className="mx-auto text-blushDark" size={26} />
            <h3 className="font-heading text-2xl font-bold text-ink">{messages.pages.agenda.emptyTitle}</h3>
            <p className="text-sm leading-6 text-mist">
              {messages.pages.agenda.emptyDescription}
            </p>
            <Link
              className="inline-flex w-full items-center justify-center rounded-full bg-blush px-5 py-3 text-sm font-semibold text-surface shadow-soft"
              to="/plans"
            >
              {messages.pages.agenda.explorePlans}
            </Link>
          </Card>
        )}
      </section>

      {(confirmedItems.length > 0 || pendingItems.length > 0) ? (
        <Link
          className={`${primaryActionClass} w-full`}
          to="/plans"
        >
          {messages.pages.agenda.planAnother}
        </Link>
      ) : null}
    </div>
  );
};
