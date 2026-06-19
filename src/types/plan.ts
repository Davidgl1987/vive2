export type BudgetPreference = 'gratis' | 'bajo' | 'medio' | 'alto' | 'variable';
export type PlanLocation = 'en casa' | 'exterior' | 'mixto';
export type PlanEnergy = 'tranquilo' | 'moderado' | 'activo';
export type PreparationDifficulty = 'baja' | 'media' | 'alta';
export type MomentIdeal = 'mañana' | 'tarde' | 'noche' | 'fin de semana';
export type ClimateIdeal = 'soleado' | 'lluvia' | 'cualquiera';
export type IntimacyLevel = 'ligero' | 'medio' | 'profundo';
export type PartnerId = 'partner_one' | 'partner_two';
export type PartnerInviteStatus = 'ready' | 'linked';
export type AgendaItemStatus = 'pending_agreement' | 'confirmed' | 'completed' | 'cancelled';
export type ChallengeGoal = 10 | 20 | 30;

export type CouplePreferences = {
  coupleName: string;
  partnerOneName: string;
  partnerTwoName: string;
};

export type CouplePlan = {
  id: string;
  plan: string;
  descripcion: string;
  parteOriginal: string;
  presupuesto: BudgetPreference;
  costeEstimado: string;
  ubicacion: PlanLocation;
  categoria: string[];
  duracion: string;
  energia: PlanEnergy;
  necesitaReserva: boolean | 'opcional' | 'depende';
  idealPara: string[];
  materiales: string[];
  ayudaCercaDeTi: string[];
  afiliadosSugeridos: string[];
  preguntaRecuerdo: string;
  textoCompartir: string;
  albumPrompt: string;
  dificultadPreparacion?: PreparationDifficulty;
  momentoIdeal?: MomentIdeal[];
  climaIdeal?: ClimateIdeal[];
  nivelIntimidad?: IntimacyLevel;
  aptoConHijos?: boolean;
  aptoLargaDistancia?: boolean;
  premium?: boolean;
  cover: string;
  isCustom?: boolean;
  createdByPartnerId?: PartnerId;
  createdAt?: string;
  updatedAt?: string;
};

export type PlanSelection = {
  partnerId: PartnerId;
  planId: string;
  selectedAt: string;
  plannedDate?: string;
  validatedPlanId?: string;
};

export type PlanDateProposal = {
  partnerId: PartnerId;
  plannedDate: string;
  selectedAt: string;
};

export type PlanResolution = {
  id: string;
  winningPlanId: string;
  winnerPartnerId: PartnerId;
  reason: string;
  createdAt: string;
};

export type AgendaItem = {
  id: string;
  planId: string;
  date?: string;
  dateProposals?: Partial<Record<PartnerId, string>>;
  status: AgendaItemStatus;
  planAcceptedBy: PartnerId[];
  dateAcceptedBy: PartnerId[];
  createdByPartnerId: PartnerId;
  createdAt: string;
  updatedAt: string;
};
