import { MapPin, Timer } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { messages } from '../../i18n';
import type { CouplePlan } from '../../types/plan';
import { Chip } from '../ui/Chip';

export const PlanCard = ({
  plan,
  completed,
  locked,
  isNext = false,
  statusBadge,
}: {
  plan: CouplePlan;
  completed: boolean;
  locked: boolean;
  isNext?: boolean;
  statusBadge?: string;
}) => {
  const location = useLocation();

  return <Link
    className={`solid-card motion-card group grid grid-cols-[112px_1fr] overflow-hidden rounded-[26px] transition duration-300 hover:-translate-y-1 hover:shadow-soft ${
      isNext ? 'ring-4 ring-primary/25' : ''
    }`}
    to={{ pathname: `/plans/${plan.id}`, search: location.search }}
  >
    <div className="relative min-h-full bg-secondarySoft p-3">
      {plan.cover ? (
        <img
          alt={plan.plan}
          className="h-full min-h-[132px] w-full rounded-[20px] object-cover transition duration-500 group-hover:scale-[1.03]"
          src={plan.cover}
        />
      ) : (
        <div className="flex h-full min-h-[132px] w-full items-center justify-center rounded-[20px] bg-gradient-to-br from-primarySoft via-eggshell to-icyAqua p-3 text-center font-heading text-2xl font-bold leading-none text-ink">
          Vive2
        </div>
      )}
      <div className="absolute left-5 top-5 rounded-full bg-surface px-2.5 py-1 text-[11px] font-extrabold text-ink shadow-[var(--shadow-card)]">
        {plan.isCustom ? messages.components.planCard.customBadge : plan.id.split('_')[1]}
      </div>
    </div>
    <div className="space-y-3 p-4 pt-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Chip>{plan.categoria[0]}</Chip>
            {plan.isCustom ? <Chip>{messages.components.planCard.customChip}</Chip> : null}
            {locked ? <Chip>{messages.components.planCard.premiumChip}</Chip> : null}
            {statusBadge ? <Chip active>{statusBadge}</Chip> : null}
          </div>
          <h3 className="text-base font-extrabold leading-snug text-ink">{plan.plan}</h3>
        </div>
        {completed ? (
          <span className="rounded-full border border-lightBlue bg-icyAqua px-3 py-1 text-xs font-semibold text-accentDark">
            {messages.components.planCard.done}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-mist">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} />
          {plan.ubicacion}
        </span>
        <span className="inline-flex items-center gap-1">
          <Timer size={14} />
          {plan.duracion}
        </span>
      </div>
    </div>
  </Link>;
};
