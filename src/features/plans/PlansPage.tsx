import { CalendarDays, Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { interpolate, messages } from '../../i18n';
import { PlanIdeaCard } from '../../components/plans/PlanIdeaCard';
import { PlanCard } from '../../components/plans/PlanCard';
import { Card } from '../../components/ui/Card';
import {
  budgetOptions,
  budgetPreferenceValues,
  customPlanLocationOptions,
  customPlanLocationValues,
  interestOptions,
  interestValues,
  type InterestValue,
} from '../../config/preferences';
import { plans as basePlans } from '../../data/plans';
import { useAppStore } from '../../store/useAppStore';
import type { BudgetPreference, PlanLocation } from '../../types/plan';
import { matchesPlanFilters, type PlanFilters } from '../../utils/planFilters';
import { getPlanStatusBadge } from '../../utils/planStatus';
import { getAllPlans } from '../../utils/plans';
import { formatLongDate } from '../../utils/format';

export const PlansPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(() =>
    ['budget', 'location', 'type'].some((key) => searchParams.has(key)),
  );
  const query = searchParams.get('q') ?? '';
  const proposedDateParam = searchParams.get('date');
  const proposedDate = proposedDateParam && /^\d{4}-\d{2}-\d{2}$/.test(proposedDateParam)
    ? proposedDateParam
    : undefined;
  const budgetParam = searchParams.get('budget');
  const locationParam = searchParams.get('location');
  const typeParam = searchParams.get('type');
  const filters: PlanFilters = {
    budget:
      budgetParam !== 'variable' &&
      budgetPreferenceValues.includes(budgetParam as BudgetPreference)
        ? (budgetParam as BudgetPreference)
        : 'todos',
    location: customPlanLocationValues.includes(locationParam as PlanLocation)
      ? (locationParam as PlanLocation)
      : 'todos',
    type: interestValues.includes(typeParam as InterestValue)
      ? (typeParam as InterestValue)
      : 'todos',
  };
  const memories = useAppStore((state) => state.memories);
  const plansUnlocked = useAppStore((state) => state.plansUnlocked);
  const customPlans = useAppStore((state) => state.customPlans);
  const agendaItems = useAppStore((state) => state.agendaItems);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const preferences = useAppStore((state) => state.preferences);
  const allPlans = useMemo(() => getAllPlans(customPlans), [customPlans]);

  const completedIds = useMemo(() => new Set(memories.map((memory) => memory.planId)), [memories]);
  const activeAgendaPlanIds = useMemo(
    () =>
      new Set(
        agendaItems
          .filter((item) => item.status !== 'completed' && item.status !== 'cancelled')
          .map((item) => item.planId),
      ),
    [agendaItems],
  );

  const filteredPlans = useMemo(
    () =>
      allPlans.filter((plan) => {
        if (completedIds.has(plan.id)) return false;
        if (activeAgendaPlanIds.has(plan.id)) return false;
        const matchesText =
          query.trim().length === 0 ||
          `${plan.plan} ${plan.descripcion}`.toLowerCase().includes(query.toLowerCase());
        return matchesPlanFilters(plan, filters) && matchesText;
      }),
    [activeAgendaPlanIds, allPlans, completedIds, filters, query],
  );

  const activeFilterCount = Object.values(filters).filter((value) => value !== 'todos').length;
  const availableBudgetOptions = budgetOptions.filter((option) => option.value !== 'variable');
  const updateSearchParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'todos') nextParams.delete(key);
    else nextParams.set(key, value);
    setSearchParams(nextParams, { replace: true });
  };
  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    ['budget', 'location', 'type'].forEach((key) => nextParams.delete(key));
    setSearchParams(nextParams, { replace: true });
  };
  const chipClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-blush text-surface shadow-soft'
        : 'border-2 border-ink/10 bg-eggshell text-ink hover:border-primary/35 hover:bg-primarySoft'
    }`;

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <h1 className="font-heading text-[2.35rem] font-bold leading-none text-ink">{messages.pages.plans.title}</h1>
        <p className="page-subtitle mt-2">
          {messages.pages.plans.subtitle}
        </p>
      </header>

      <PlanIdeaCard />

      {proposedDate ? (
        <Card className="flex items-center gap-3 !p-4 bg-gradient-to-br from-primarySoft to-secondarySoft">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-blushDark shadow-sm">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink">{messages.pages.plans.proposedDate.title}</p>
            <p className="mt-1 text-sm text-mist">
              {interpolate(messages.pages.plans.proposedDate.description, {
                date: formatLongDate(proposedDate),
              })}
            </p>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-mist/70" size={18} />
          <input
            className="field field-with-icon"
            placeholder={messages.pages.plans.searchPlaceholder}
            value={query}
            onChange={(event) => updateSearchParam('q', event.target.value)}
          />
        </label>
        <button
          aria-expanded={filtersOpen}
          aria-label={messages.pages.plans.filters.open}
          className={`relative grid h-[52px] w-[52px] place-items-center rounded-full shadow-soft transition ${
            filtersOpen || activeFilterCount > 0 ? 'bg-blush text-surface' : 'bg-surface text-ink'
          }`}
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal size={20} />
          {activeFilterCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-extrabold text-surface">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      {filtersOpen ? (
        <Card className="space-y-5 bg-gradient-to-br from-surface via-eggshell to-secondarySoft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-ink">{messages.pages.plans.filters.title}</h2>
              <p className="mt-1 text-sm text-mist">{messages.pages.plans.filters.description}</p>
            </div>
            {activeFilterCount > 0 ? (
              <button
                className="inline-flex items-center gap-1 text-xs font-bold text-blushDark"
                type="button"
                onClick={clearFilters}
              >
                <X size={14} />
                {messages.pages.plans.filters.clear}
              </button>
            ) : null}
          </div>

          <section className="space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mist">{messages.pages.plans.filters.budget}</p>
            <div className="flex flex-wrap gap-2">
              <button className={chipClass(filters.budget === 'todos')} type="button" onClick={() => updateSearchParam('budget', 'todos')}>
                {messages.pages.plans.filters.all}
              </button>
              {availableBudgetOptions.map((option) => (
                <button key={option.value} className={chipClass(filters.budget === option.value)} type="button" onClick={() => updateSearchParam('budget', option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mist">{messages.pages.plans.filters.location}</p>
            <div className="flex flex-wrap gap-2">
              <button className={chipClass(filters.location === 'todos')} type="button" onClick={() => updateSearchParam('location', 'todos')}>
                {messages.pages.plans.filters.all}
              </button>
              {customPlanLocationOptions.map((option) => (
                <button key={option.value} className={chipClass(filters.location === option.value)} type="button" onClick={() => updateSearchParam('location', option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mist">{messages.pages.plans.filters.type}</p>
            <div className="flex flex-wrap gap-2">
              <button className={chipClass(filters.type === 'todos')} type="button" onClick={() => updateSearchParam('type', 'todos')}>
                {messages.pages.plans.filters.all}
              </button>
              {interestOptions.map((option) => (
                <button key={option.value} className={chipClass(filters.type === option.value)} type="button" onClick={() => updateSearchParam('type', option.value)}>
                  <span className="mr-1">{option.icon}</span>
                  {messages.preferences.interests[option.value]}
                </button>
              ))}
            </div>
          </section>
        </Card>
      ) : null}

      {filteredPlans.length === 0 ? (
        <Card className="text-center">
          <p className="font-bold text-ink">{messages.pages.plans.empty.title}</p>
          <p className="mt-1 text-sm text-mist">{messages.pages.plans.empty.description}</p>
          <button
            className="mt-4 text-sm font-bold text-blushDark"
            type="button"
            onClick={() => {
              setSearchParams({}, { replace: true });
            }}
          >
            {messages.pages.plans.empty.clear}
          </button>
        </Card>
      ) : null}

      <div className="grid gap-4 pb-4">
        {filteredPlans.map((plan) => {
          const baseIndex = basePlans.findIndex((item) => item.id === plan.id);
          return (
          <PlanCard
            key={plan.id}
            completed={completedIds.has(plan.id)}
            isNext={agendaItems.some((item) => item.planId === plan.id && item.status === 'confirmed')}
            locked={!plan.isCustom && baseIndex >= plansUnlocked}
            plan={plan}
            statusBadge={getPlanStatusBadge({
              agendaItems,
              planId: plan.id,
              currentPartnerId,
              preferences,
            })}
          />
          );
        })}
      </div>
    </div>
  );
};
