import { plans } from '../data/plans';
import type { BudgetPreference, CouplePlan, PartnerId, PlanLocation } from '../types/plan';
import { createId } from './id';
import { getNowIso } from './format';

const titleFromIdea = (idea: string) => {
  const clean = idea.trim().replace(/\s+/g, ' ');
  if (clean.length <= 52) return clean;
  return `${clean.slice(0, 49).trim()}...`;
};

export const createCustomPlan = (idea: string, partnerId: PartnerId): CouplePlan => {
  const title = titleFromIdea(idea);
  const now = getNowIso();

  return {
    id: `custom_${createId()}`,
    plan: title,
    descripcion: idea.trim(),
    parteOriginal: 'Una idea vuestra, creada para convertirla en un momento compartido.',
    presupuesto: 'variable',
    costeEstimado: 'Por definir',
    ubicacion: 'mixto',
    categoria: ['creado por vosotros'],
    duracion: 'Por definir',
    energia: 'tranquilo',
    necesitaReserva: 'depende',
    idealPara: ['hacerlo vuestro'],
    materiales: [],
    ayudaCercaDeTi: [],
    afiliadosSugeridos: [],
    preguntaRecuerdo: '¿Que hizo especial este plan que se os ocurrio a vosotros?',
    textoCompartir: `Hemos añadido "${title}" a nuestros planes de Vive2.`,
    albumPrompt: `Recuerdo natural de pareja viviendo el plan "${title}".`,
    cover: '',
    isCustom: true,
    createdByPartnerId: partnerId,
    createdAt: now,
    updatedAt: now,
  };
};

export const getAllPlans = (customPlans: CouplePlan[] = []) => [...customPlans, ...plans];

export const findPlanById = (customPlans: CouplePlan[], planId?: string) =>
  getAllPlans(customPlans).find((plan) => plan.id === planId);

export const normalizeCustomPlanUpdate = (values: {
  plan: string;
  descripcion: string;
  ubicacion: PlanLocation;
  duracion: string;
  presupuesto: BudgetPreference;
  categoria: string;
}) => ({
  plan: values.plan.trim(),
  descripcion: values.descripcion.trim(),
  ubicacion: values.ubicacion,
  duracion: values.duracion.trim(),
  presupuesto: values.presupuesto,
  categoria: values.categoria
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
  updatedAt: getNowIso(),
});
