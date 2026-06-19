import { AnimatePresence, motion } from 'framer-motion';
import {
  BellRing,
  BookHeart,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  House,
  SlidersHorizontal,
  Settings2,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ConfirmedPlansCalendar } from '../../components/agenda/ConfirmedPlansCalendar';
import { AgendaAgreementCard } from '../../components/agenda/AgendaAgreementCard';
import { ChallengeGoalSelector } from '../../components/challenge/ChallengeGoalSelector';
import { ChallengeProgress } from '../../components/challenge/ChallengeProgress';
import { MobileFrame } from '../../components/layout/MobileFrame';
import { MemoryCard } from '../../components/plans/MemoryCard';
import { PlanCard } from '../../components/plans/PlanCard';
import { PartnerNameFields } from '../../components/profile/PartnerNameFields';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { plans } from '../../data/plans';
import { interpolate, messages } from '../../i18n';
import type { CompletedPlan } from '../../types/memory';
import type { AgendaItem, CouplePreferences } from '../../types/plan';
import { addDaysToDateKey, formatLongDate, getTodayDateInput } from '../../utils/format';
import { getPublicAssetUrl } from '../../utils/assets';

type TourSlide = {
  icon: LucideIcon;
  key: keyof typeof messages.pages.onboardingTour.slides;
  accent: string;
  soft: string;
};

type MockNames = {
  partnerOneName: string;
  partnerTwoName: string;
};

const slides: TourSlide[] = [
  { key: 'home', icon: House, accent: 'text-blushDark', soft: 'bg-primarySoft' },
  { key: 'plans', icon: SlidersHorizontal, accent: 'text-secondaryDark', soft: 'bg-secondary/20' },
  { key: 'agenda', icon: CalendarDays, accent: 'text-accentDark', soft: 'bg-secondarySoft' },
  { key: 'memories', icon: BookHeart, accent: 'text-blushDark', soft: 'bg-primarySoft' },
  { key: 'profile', icon: UserRound, accent: 'text-warning', soft: 'bg-warning/15' },
];

const mockPlan = plans[0];
const mockMemoryPlan = plans[7] ?? mockPlan;
const mockPreferences: CouplePreferences = {
  coupleName: 'Cris y David',
  partnerOneName: 'Cris',
  partnerTwoName: 'David',
};

const buildMockAgendaItem = (): AgendaItem => {
  const firstDate = addDaysToDateKey(getTodayDateInput(), 2);
  const secondDate = addDaysToDateKey(getTodayDateInput(), 4);
  return {
    id: 'onboarding_agenda',
    planId: mockPlan.id,
    dateProposals: { partner_one: firstDate, partner_two: secondDate },
    status: 'pending_agreement',
    planAcceptedBy: ['partner_one', 'partner_two'],
    dateAcceptedBy: [],
    createdByPartnerId: 'partner_one',
    createdAt: `${firstDate}T12:00:00.000Z`,
    updatedAt: `${firstDate}T12:00:00.000Z`,
  };
};

const buildMockMemory = (): CompletedPlan => ({
  id: 'onboarding_memory',
  coupleId: 'onboarding_couple',
  planId: mockMemoryPlan.id,
  planTitle: mockMemoryPlan.plan,
  date: getTodayDateInput(),
  locationName: 'Nuestro lugar favorito',
  photos: [],
  note: 'Un recuerdo para volver siempre.',
  rating: 5,
  sharedCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const OnboardingTourPage = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const content = messages.pages.onboardingTour.slides[slide.key];
  const isLast = index === slides.length - 1;
  const mockAgendaItem = buildMockAgendaItem();
  const mockMemory = buildMockMemory();
  const firstAgendaDate = mockAgendaItem.dateProposals?.partner_one ?? getTodayDateInput();
  const secondAgendaDate = mockAgendaItem.dateProposals?.partner_two ?? getTodayDateInput();
  const mockCalendarItems: AgendaItem[] = [
    { ...mockAgendaItem, id: 'onboarding_calendar_one', date: firstAgendaDate, status: 'confirmed' },
    { ...mockAgendaItem, id: 'onboarding_calendar_two', date: secondAgendaDate, status: 'confirmed' },
  ];
  const { register, getValues, setValue } = useForm<MockNames>({
    defaultValues: {
      partnerOneName: mockPreferences.partnerOneName,
      partnerTwoName: mockPreferences.partnerTwoName,
    },
  });

  const handleSwapNames = () => {
    const partnerOneName = getValues('partnerOneName');
    const partnerTwoName = getValues('partnerTwoName');
    setValue('partnerOneName', partnerTwoName);
    setValue('partnerTwoName', partnerOneName);
  };

  const preview = {
    home: (
      <div className="space-y-4">
        <header className="pt-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface/80 py-1 pl-1 pr-3 shadow-[0_8px_22px_rgb(var(--color-overlay)/0.08)]">
            <img alt={messages.common.brandAlt} className="h-7 w-7" src={getPublicAssetUrl('logo/vive2-icono-72x72.png')} />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush">{messages.common.appName}</p>
          </div>
          <h2 className="mt-2 font-heading text-[2.25rem] font-bold leading-none text-ink">
            {interpolate(messages.pages.home.greeting, { name: mockPreferences.partnerOneName })}
            <span className="text-blush"> ♥</span>
          </h2>
          <p className="page-subtitle mt-2">
            {interpolate(messages.pages.home.subtitle, { name: mockPreferences.partnerTwoName })}
          </p>
        </header>
        <Card className="overflow-hidden !p-0">
          <div className="relative h-48">
            <img alt={mockPlan.plan} className="h-full w-full object-cover" src={mockPlan.cover} />
            <div className="absolute inset-0 bg-gradient-to-t from-overlay/75 via-overlay/15 to-transparent" />
            <div className="absolute left-4 top-4 rounded-full bg-surface px-3 py-1 text-xs font-extrabold text-blush shadow-[var(--shadow-card)]">
              {messages.pages.home.recommendedForToday}
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-surface">
              <h3 className="text-2xl font-bold">{mockPlan.plan}</h3>
              <p className="mt-2 text-sm text-surface/85">{mockPlan.descripcion}</p>
            </div>
          </div>
        </Card>
        <Card><ChallengeProgress completed={4} goal={10} /></Card>
        <Card className="space-y-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-mist/70">
            <CalendarDays size={16} />
            {messages.pages.home.agendaSummary}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-eggshell px-4 py-3">
              <p className="text-2xl font-extrabold text-ink">2</p>
              <p className="text-xs font-bold text-mist">{messages.pages.home.agreedPlans}</p>
            </div>
            <div className="rounded-[18px] bg-primarySoft px-4 py-3">
              <p className="text-2xl font-extrabold text-ink">4</p>
              <p className="text-xs font-bold text-mist">{messages.pages.home.toAgree}</p>
            </div>
          </div>
        </Card>
      </div>
    ),
    plans: (
      <motion.div
        animate={{ y: [0, -430, -430, 0] }}
        className="space-y-4"
        transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity, times: [0, 0.7, 0.85, 1] }}
      >
        <Card className="space-y-3">
          <input className="field" placeholder={messages.pages.plans.searchPlaceholder} readOnly />
          <div className="flex gap-2">
            <Chip active>{messages.preferences.budget.gratis}</Chip>
            <Chip>{messages.preferences.customPlanLocation.exterior}</Chip>
            <Chip>{messages.preferences.interests.relax}</Chip>
          </div>
        </Card>
        {plans.slice(0, 4).map((plan) => (
          <PlanCard key={plan.id} completed={false} locked={Boolean(plan.premium)} plan={plan} />
        ))}
      </motion.div>
    ),
    agenda: (
      <div className="space-y-4">
        <ConfirmedPlansCalendar
          items={mockCalendarItems}
          selectedDate={firstAgendaDate}
          onSelectDate={() => undefined}
        />
        <AgendaAgreementCard
          currentPartnerId="partner_one"
          item={mockAgendaItem}
          planTitle={mockPlan.plan}
          preferences={mockPreferences}
          showPlanLink={false}
          onAcceptDate={() => undefined}
          onAcceptPlan={() => undefined}
          onCancel={() => undefined}
          onSetDate={() => undefined}
        />
      </div>
    ),
    memories: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <BookHeart className="text-blushDark" size={18} />
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-mist">
            {messages.pages.memories.current.sectionTitle}
          </h2>
        </div>
        <Card className="space-y-5">
          <div>
            <h3 className="font-heading text-2xl font-bold text-ink">
              {formatLongDate(getTodayDateInput())}
            </h3>
            <p className="mt-1 text-sm font-semibold text-mist">
              {interpolate(messages.pages.memories.current.goal, { count: 10 })}
            </p>
          </div>
          <ChallengeProgress completed={4} goal={10} />
          <MemoryCard memory={mockMemory} planImage={mockMemoryPlan.cover} />
        </Card>
      </div>
    ),
    profile: (
      <div className="space-y-4">
        <Card className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <BellRing className="mt-1 text-blush" size={20} />
              <div>
                <h2 className="text-lg font-bold text-ink">{messages.pages.profile.notifications.title}</h2>
                <p className="mt-1 text-sm leading-6 text-mist">
                  {interpolate(messages.pages.profile.notifications.description, {
                    label: interpolate(messages.pages.profile.notifications.daysBefore, { count: 2, suffix: 's' }),
                  })}
                </p>
              </div>
            </div>
            <input
              aria-label={messages.pages.profile.notifications.ariaLabel}
              checked
              className="control-checkbox"
              readOnly
              type="checkbox"
            />
          </div>
          <Button><Settings2 className="mr-2" size={16} />{messages.pages.profile.notifications.configure}</Button>
        </Card>
        <Card className="space-y-5">
          <PartnerNameFields
            partnerOneRegistration={register('partnerOneName')}
            partnerTwoRegistration={register('partnerTwoName')}
            onSwap={handleSwapNames}
          />
          <ChallengeGoalSelector value={20} onChange={() => undefined} />
        </Card>
      </div>
    ),
  };

  return (
    <MobileFrame>
      <div className="flex min-h-full flex-col px-1 pb-4 pt-2">
        <div className="mb-5 flex items-center justify-between">
          <button
            aria-label={messages.pages.onboardingTour.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink shadow-sm"
            type="button"
            onClick={() => (index === 0 ? navigate('/onboarding') : setIndex(index - 1))}
          >
            <ChevronLeft size={20} />
          </button>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-mist">
            {index + 1} / {slides.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.key}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-1 flex-col"
            exit={{ opacity: 0, x: -24 }}
            initial={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`relative h-[310px] overflow-hidden rounded-[34px] ${slide.soft}`}>
              <div
                className="pointer-events-none absolute left-1/2 top-0 w-[540px] space-y-4 p-5"
                style={{
                  transform: `translateX(-50%) scale(${slide.key === 'home' || slide.key === 'profile' ? 0.52 : 0.61})`,
                  transformOrigin: 'top center',
                }}
              >
                {preview[slide.key]}
              </div>
            </div>
            <div className="px-2 pb-6 pt-7">
              <p className={`mb-2 text-sm font-extrabold uppercase tracking-[0.18em] ${slide.accent}`}>
                {content.eyebrow}
              </p>
              <h1 className="text-3xl font-black leading-tight text-ink">{content.title}</h1>
              <p className="mt-3 text-base leading-7 text-mist">{content.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-4">
          <div className="flex justify-center gap-2" aria-hidden="true">
            {slides.map((item, dotIndex) => (
              <span
                key={item.key}
                className={`h-2 rounded-full transition-all ${dotIndex === index ? 'w-8 bg-blush' : 'w-2 bg-ink/10'}`}
              />
            ))}
          </div>
          <Button onClick={() => (isLast ? navigate('/onboarding/auth') : setIndex(index + 1))}>
            <span className="inline-flex items-center gap-2">
              {isLast ? messages.pages.onboardingTour.finish : messages.common.actions.continue}
              <ChevronRight size={18} />
            </span>
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
};
