import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarHeart, Camera, ListChecks } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ChallengeGoalSelector } from '../../components/challenge/ChallengeGoalSelector';
import { MobileFrame } from '../../components/layout/MobileFrame';
import { PartnerNameFields } from '../../components/profile/PartnerNameFields';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { messages } from '../../i18n';
import {
  preferencesSchema,
  toCouplePreferences,
  type PreferencesFormValues,
} from '../preferences/preferences.schema';
import { useAppStore } from '../../store/useAppStore';
import { normalizePreferences } from '../../utils/preferences';

const FieldLabel = ({ children }: { children: string }) => (
  <label className="mb-2 block text-sm font-semibold text-ink">{children}</label>
);

const flowSteps = [
  { icon: ListChecks, label: messages.pages.preferences.flowSteps.ideas },
  { icon: CalendarHeart, label: messages.pages.preferences.flowSteps.agenda },
  { icon: Camera, label: messages.pages.preferences.flowSteps.memories },
];

export const PreferencesPage = () => {
  const navigate = useNavigate();
  const storedPreferences = useAppStore((state) => state.preferences);
  const preferences = normalizePreferences(storedPreferences);
  const activeChallenge = useAppStore((state) => state.activeChallenge);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const setChallengeGoal = useAppStore((state) => state.setChallengeGoal);

  const defaultValues = useMemo<PreferencesFormValues>(
    () => ({
      partnerOneName: preferences.partnerOneName,
      partnerTwoName: preferences.partnerTwoName,
    }),
    [preferences],
  );

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    register,
  } = useForm<PreferencesFormValues>({
    defaultValues,
    resolver: zodResolver(preferencesSchema),
  });

  const onSubmit = (values: PreferencesFormValues) => {
    completeOnboarding(toCouplePreferences(values));
    navigate('/onboarding/ready');
  };

  const handleSwapNames = () => {
    const partnerOneName = watch('partnerOneName');
    const partnerTwoName = watch('partnerTwoName');
    setValue('partnerOneName', partnerTwoName, { shouldDirty: true, shouldValidate: true });
    setValue('partnerTwoName', partnerOneName, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <MobileFrame>
      <PageHeader
        backTo="/onboarding/auth"
        subtitle={messages.pages.preferences.subtitle}
        title={messages.pages.preferences.title}
      />

      <form className="space-y-4 pb-6" onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-4 bg-gradient-to-br from-surface via-eggshell to-secondarySoft">
          <p className="text-sm font-semibold leading-6 text-mist">
            {messages.pages.preferences.intro}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {flowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="rounded-[18px] bg-surface/82 px-3 py-3 text-center">
                  <Icon className="mx-auto text-blushDark" size={18} />
                  <p className="mt-2 text-xs font-extrabold text-ink">{step.label}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <FieldLabel>{messages.pages.preferences.whoAreYou}</FieldLabel>
            <PartnerNameFields
              partnerOneRegistration={register('partnerOneName')}
              partnerTwoRegistration={register('partnerTwoName')}
              onSwap={handleSwapNames}
            />
            {errors.partnerOneName ? (
              <p className="mt-2 text-sm text-blush">{errors.partnerOneName.message}</p>
            ) : null}
            {errors.partnerTwoName ? (
              <p className="mt-2 text-sm text-blush">{errors.partnerTwoName.message}</p>
            ) : null}
          </div>

          <ChallengeGoalSelector value={activeChallenge.goal} onChange={setChallengeGoal} />
        </Card>

        <Button type="submit">{messages.pages.preferences.submit}</Button>
      </form>
    </MobileFrame>
  );
};
