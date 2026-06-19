import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { messages } from '../../i18n';
import type { AgendaItem } from '../../types/plan';
import {
  addDaysToDateKey,
  formatDateKeyDayLabel,
  formatDateKeyMonthLabel,
  formatDateKeyWeekdayLabel,
  getDateKey,
  getTodayDateInput,
  formatLongDate,
} from '../../utils/format';

const visibleDatesCount = 5;

export const ConfirmedPlansCalendar = ({
  items,
  selectedDate,
  onSelectDate,
}: {
  items: AgendaItem[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) => {
  const dateEntries = useMemo(() => {
    const counts = new Map<string, number>();

    items.forEach((item) => {
      const dateKey = getDateKey(item.date);
      if (!dateKey) return;
      counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
      .map(([dateKey, plansCount]) => ({ dateKey, plansCount }));
  }, [items]);

  const today = getTodayDateInput();
  const clampDateWindowStart = (dateKey: string) => (dateKey < today ? today : dateKey);

  const resolveFocusDate = () => {
    if (selectedDate) return selectedDate;
    return dateEntries.find((entry) => entry.dateKey >= today)?.dateKey ?? dateEntries[dateEntries.length - 1]?.dateKey;
  };

  const [windowStart, setWindowStart] = useState(() => {
    const focusDate = resolveFocusDate();
    return focusDate ? clampDateWindowStart(addDaysToDateKey(focusDate, -1)) : today;
  });

  useEffect(() => {
    const clampedStart = clampDateWindowStart(windowStart);
    if (clampedStart !== windowStart) {
      setWindowStart(clampedStart);
    }
  }, [today, windowStart]);

  useEffect(() => {
    if (!selectedDate) return;

    const windowEnd = addDaysToDateKey(windowStart, visibleDatesCount - 1);
    if (selectedDate < windowStart || selectedDate > windowEnd) {
      setWindowStart(clampDateWindowStart(addDaysToDateKey(selectedDate, -1)));
    }
  }, [selectedDate]);

  const countsByDate = new Map(dateEntries.map((entry) => [entry.dateKey, entry.plansCount]));
  const visibleDateKeys = useMemo(() => {
    const dates: string[] = [];
    const currentDate = new Date(`${windowStart}T12:00:00`);

    for (let index = 0; index < visibleDatesCount; index += 1) {
      dates.push(currentDate.toISOString().slice(0, 10));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, [windowStart]);
  const canGoPrev = windowStart > today;

  return (
    <div className="solid-card rounded-[26px] p-3.5 pt-5">
      <div className="flex items-center gap-0">
        <button
          className="grid h-5 w-5 shrink-0 place-items-center text-mist transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          type="button"
          aria-label={messages.components.confirmedPlansCalendar.previousDates}
          disabled={!canGoPrev}
          onClick={() =>
            canGoPrev &&
            setWindowStart((currentStart) =>
              clampDateWindowStart(addDaysToDateKey(currentStart, -visibleDatesCount)),
            )
          }
        >
          <ChevronLeft size={14} />
        </button>

        <div className="grid min-w-0 flex-1 grid-cols-5 gap-2.5 px-1">
          {visibleDateKeys.map((dateKey) => {
            const plansCount = countsByDate.get(dateKey) ?? 0;
            const hasPlan = plansCount > 0;
            const selected = selectedDate === dateKey;

            return (
              <button
                key={dateKey}
                className={`relative flex h-[88px] min-w-0 flex-col items-center justify-center rounded-[18px] px-2 text-center transition ${selected
                  ? hasPlan
                    ? 'bg-primary text-surface shadow-soft'
                    : 'bg-eggshell text-ink shadow-[inset_0_0_0_1px_rgb(var(--color-text)/0.06)]'
                  : hasPlan
                    ? 'bg-surface text-[rgb(var(--color-primary))] hover:bg-primarySoft'
                    : 'bg-transparent text-[rgb(var(--color-muted)/0.62)] hover:bg-eggshell hover:text-ink'
                  }`}
                type="button"
                aria-label={formatLongDate(dateKey)}
                aria-pressed={selected}
                onClick={() => onSelectDate(dateKey)}
              >
                {hasPlan ? (
                  <span
                    className={`absolute inset-0 rounded-[18px] border-2 ${selected ? 'border-primary bg-primary' : 'border-primary/45'
                      }`}
                  />
                ) : null}
                <span
                  className={`relative z-10 text-[11px] font-semibold uppercase tracking-[0.08em] ${selected
                    ? hasPlan
                      ? 'text-surface/90'
                      : 'text-mist'
                    : hasPlan
                      ? 'text-[rgb(var(--color-primary))]'
                      : 'text-[rgb(var(--color-muted)/0.62)]'
                    }`}
                >
                  {formatDateKeyMonthLabel(dateKey)}
                </span>
                <span
                  className={`relative z-10 mt-1 px-2.5 py-1 text-[1.6rem] font-extrabold leading-none ${selected
                    ? hasPlan
                      ? 'text-surface'
                      : 'text-ink'
                    : hasPlan
                      ? 'text-[rgb(var(--color-primary))]'
                      : 'text-ink'
                    }`}
                >
                  {formatDateKeyDayLabel(dateKey)}
                </span>
                <span
                  className={`relative z-10 text-[11px] font-semibold uppercase tracking-[0.08em] ${selected
                    ? hasPlan
                      ? 'text-surface/90'
                      : 'text-mist'
                    : hasPlan
                      ? 'text-[rgb(var(--color-primary))]'
                      : 'text-[rgb(var(--color-muted)/0.62)]'
                    }`}
                >
                  {formatDateKeyWeekdayLabel(dateKey)}
                </span>
              </button>
            );
          })}
        </div>

        <button
          className="grid h-5 w-5 shrink-0 place-items-center text-mist transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          type="button"
          aria-label={messages.components.confirmedPlansCalendar.nextDates}
          onClick={() => setWindowStart((currentStart) => addDaysToDateKey(currentStart, visibleDatesCount))}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
