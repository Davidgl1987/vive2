import { MapPin, Sparkles, Timer } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { budgetOptions, customPlanLocationOptions } from '../../config/preferences';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { ChoiceGroup } from '../../components/ui/ChoiceGroup';
import { FeedbackModal } from '../../components/ui/FeedbackModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { interpolate, messages } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import type { BudgetPreference, PlanLocation } from '../../types/plan';
import { formatLongDate } from '../../utils/format';
import { buildGoogleMapsSearchUrl } from '../../utils/maps';
import { getPlanStatusBadge } from '../../utils/planStatus';
import { normalizePreferences } from '../../utils/preferences';
import { findPlanById, normalizeCustomPlanUpdate } from '../../utils/plans';

export const PlanDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { planId } = useParams();
  const customPlans = useAppStore((state) => state.customPlans);
  const preferences = normalizePreferences(useAppStore((state) => state.preferences));
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const agendaItems = useAppStore((state) => state.agendaItems);
  const proposeAgendaPlan = useAppStore((state) => state.proposeAgendaPlan);
  const setAgendaDate = useAppStore((state) => state.setAgendaDate);
  const updateCustomPlan = useAppStore((state) => state.updateCustomPlan);
  const plan = findPlanById(customPlans, planId);
  const [editValues, setEditValues] = useState({
    plan: plan?.plan ?? '',
    descripcion: plan?.descripcion ?? '',
    ubicacion: plan?.ubicacion ?? 'mixto',
    duracion: plan?.duracion ?? 'Por definir',
    presupuesto: plan?.presupuesto ?? 'variable',
    categoria: plan?.categoria.join(', ') ?? 'creado por vosotros',
  });
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const proposedDateParam = new URLSearchParams(location.search).get('date');
  const proposedDate = proposedDateParam && /^\d{4}-\d{2}-\d{2}$/.test(proposedDateParam)
    ? proposedDateParam
    : undefined;

  if (!plan) {
    return <div className="pt-10 text-center text-mist">{messages.pages.planDetail.notFound}</div>;
  }

  const agendaItem = agendaItems.find(
    (item) =>
      item.planId === plan.id &&
      item.status !== 'completed' &&
      item.status !== 'cancelled',
  );
  const statusBadge = getPlanStatusBadge({
    agendaItems,
    planId: plan.id,
    currentPartnerId,
    preferences,
  });
  const actionLabel = agendaItem?.status === 'confirmed'
    ? messages.pages.planDetail.agenda.confirmed
    : agendaItem
      ? messages.pages.planDetail.agenda.pending
      : messages.pages.planDetail.agenda.idle;
  const actionDescription = agendaItem?.status === 'confirmed'
    ? messages.pages.planDetail.agenda.confirmedDescription
    : agendaItem
      ? messages.pages.planDetail.agenda.pendingDescription
      : proposedDate
        ? interpolate(messages.pages.planDetail.agenda.idleDateDescription, {
            date: formatLongDate(proposedDate),
          })
        : messages.pages.planDetail.agenda.idleDescription;
  const suggestionTags = plan.ayudaCercaDeTi.length > 0 ? plan.ayudaCercaDeTi : [plan.plan];

  const handlePlanAgenda = () => {
    if (!agendaItem) {
      const agendaItemId = proposeAgendaPlan(plan.id);
      if (proposedDate) setAgendaDate(agendaItemId, proposedDate);
    }
    navigate('/agenda');
  };

  const handleSaveCustomPlan = () => {
    if (!editValues.plan.trim()) return;
    updateCustomPlan(plan.id, normalizeCustomPlanUpdate({
      plan: editValues.plan,
      descripcion: editValues.descripcion,
      ubicacion: editValues.ubicacion as PlanLocation,
      duracion: editValues.duracion,
      presupuesto: editValues.presupuesto as BudgetPreference,
      categoria: editValues.categoria,
    }));
    setFeedbackOpen(true);
  };

  return (
    <div className="space-y-5 pb-4">
      <PageHeader backTo={`/plans${location.search}`} title={plan.plan} />

      <div className="overflow-hidden rounded-[30px] bg-surface shadow-soft">
        {plan.cover ? (
          <img alt={plan.plan} className="h-56 w-full object-cover" src={plan.cover} />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-primarySoft via-eggshell to-icyAqua px-8 text-center font-heading text-4xl font-bold leading-none text-ink">
            Vive2
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {plan.categoria.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
        {plan.isCustom ? <Chip active>{messages.pages.planDetail.customChip}</Chip> : null}
        {statusBadge ? <Chip active>{statusBadge}</Chip> : null}
      </div>

      <Card
        className={`space-y-4 ${agendaItem?.status === 'confirmed' ? 'cursor-pointer' : ''}`}
        role={agendaItem?.status === 'confirmed' ? 'button' : undefined}
        tabIndex={agendaItem?.status === 'confirmed' ? 0 : undefined}
        onClick={agendaItem?.status === 'confirmed' ? () => navigate('/agenda') : undefined}
        onKeyDown={agendaItem?.status === 'confirmed'
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigate('/agenda');
              }
            }
          : undefined}
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blush">
            {messages.pages.planDetail.agenda.eyebrow}
          </p>
          <h2 className="mt-2 text-lg font-bold text-ink">{actionLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-mist">{actionDescription}</p>
        </div>
        {agendaItem?.status === 'confirmed' ? (
          <div className="flex justify-end">
            <Link
              to={`/plans/${plan.id}/complete`}
              onClick={(event) => event.stopPropagation()}
            >
              <Button type="button" fullWidth={false}>
                <Sparkles className="mr-2" size={16} />
                Vivirlo
              </Button>
            </Link>
          </div>
        ) : (
          <Button type="button" onClick={handlePlanAgenda}>
            {agendaItem
              ? messages.pages.planDetail.agenda.resolve
              : proposedDate
                ? messages.pages.planDetail.agenda.planThisDate
                : messages.pages.planDetail.agenda.planThis}
          </Button>
        )}
      </Card>

      {plan.isCustom ? (
        <Card className="space-y-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blush">
              {messages.pages.planDetail.custom.eyebrow}
            </p>
            <h2 className="mt-2 text-lg font-bold text-ink">{messages.pages.planDetail.custom.title}</h2>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">{messages.pages.planDetail.custom.titleLabel}</span>
            <input
              className="field"
              value={editValues.plan}
              onChange={(event) => setEditValues((values) => ({ ...values, plan: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">{messages.pages.planDetail.custom.descriptionLabel}</span>
            <textarea
              className="field min-h-28 resize-none"
              value={editValues.descripcion}
              onChange={(event) =>
                setEditValues((values) => ({ ...values, descripcion: event.target.value }))
              }
            />
          </label>
          <ChoiceGroup
            label={messages.pages.planDetail.custom.locationLabel}
            options={customPlanLocationOptions}
            value={editValues.ubicacion}
            onChange={(value) =>
              setEditValues((values) => ({
                ...values,
                ubicacion: value as PlanLocation,
              }))
            }
          />
          <ChoiceGroup
            label={messages.pages.planDetail.custom.budgetLabel}
            options={budgetOptions}
            value={editValues.presupuesto}
            onChange={(value) =>
              setEditValues((values) => ({
                ...values,
                presupuesto: value as BudgetPreference,
              }))
            }
          />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">{messages.pages.planDetail.custom.durationLabel}</span>
            <input
              className="field"
              value={editValues.duracion}
              onChange={(event) => setEditValues((values) => ({ ...values, duracion: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">{messages.pages.planDetail.custom.categoriesLabel}</span>
            <input
              className="field"
              value={editValues.categoria}
              onChange={(event) => setEditValues((values) => ({ ...values, categoria: event.target.value }))}
            />
          </label>
          <Button type="button" variant="secondary" onClick={handleSaveCustomPlan}>
            {messages.pages.planDetail.custom.save}
          </Button>
        </Card>
      ) : null}

      <Card className="space-y-4">
        <p className="text-base leading-7 text-mist/90">{plan.descripcion}</p>
        <div className="rounded-[22px] bg-gradient-to-r from-secondarySoft to-primarySoft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush">
            {messages.pages.planDetail.originalPart}
          </p>
          <p className="mt-2 text-sm leading-7 text-ink">{plan.parteOriginal}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="space-y-2">
          <Timer className="text-blush" size={18} />
          <p className="text-sm font-semibold text-mist/70">{messages.pages.planDetail.duration}</p>
          <p className="text-base font-bold text-ink">{plan.duracion}</p>
        </Card>
        <Card className="space-y-2">
          <Sparkles className="text-blush" size={18} />
          <p className="text-sm font-semibold text-mist/70">{messages.pages.planDetail.budget}</p>
          <p className="text-base font-bold text-ink">{plan.costeEstimado}</p>
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-ink">{messages.pages.planDetail.materials}</h2>
        <ul className="space-y-2 text-sm text-mist/90">
          {plan.materiales.length > 0 ? (
            plan.materiales.map((item) => <li key={item}>• {item}</li>)
          ) : (
            <li>• {messages.pages.planDetail.noMaterials}</li>
          )}
        </ul>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">{messages.pages.planDetail.whereToDoIt.title}</h2>
            <p className="mt-1 text-sm text-mist">
              {messages.pages.planDetail.whereToDoIt.description}
            </p>
            <p className="mt-2 text-sm font-semibold text-blushDark">
              {messages.pages.planDetail.whereToDoIt.locationHint}
            </p>
          </div>
          <MapPin className="text-blush" size={18} />
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestionTags.map((tag) => (
            <a
              key={tag}
              className="inline-flex items-center rounded-full bg-eggshell px-3 py-2 text-xs font-semibold text-ink transition hover:bg-primarySoft hover:text-blushDark"
              href={buildGoogleMapsSearchUrl(tag)}
              rel="noreferrer"
              target="_blank"
            >
              {tag}
            </a>
          ))}
        </div>
      </Card>

      <p className="text-center text-sm text-mist/70">
        Pregunta recuerdo: {plan.preguntaRecuerdo}
      </p>

      <FeedbackModal
        message="La idea propia se ha actualizado y seguirá disponible en vuestra lista."
        open={feedbackOpen}
        title="Plan actualizado"
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
};
