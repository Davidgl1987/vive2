import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card } from '../../components/ui/Card';
import { ChoiceGroup } from '../../components/ui/ChoiceGroup';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAppStore } from '../../store/useAppStore';
import type { ReminderSettings } from '../../types/reminder';

const schema = z.object({
  enabled: z.boolean(),
  daysBeforePlan: z.number().min(0).max(14),
  notifyOnPlanProposal: z.boolean(),
  notifyOnDateProposal: z.boolean(),
  notifyOnPartnerAccepted: z.boolean(),
  notifyOnConfirmedPlan: z.boolean(),
});

type NotificationFormValues = z.infer<typeof schema>;

const daysBeforeOptions = [
  { label: 'El mismo día', value: 0 },
  { label: '1 día antes', value: 1 },
  { label: '2 días antes', value: 2 },
  { label: '3 días antes', value: 3 },
  { label: '1 semana antes', value: 7 },
] as const;

const normalizeNotificationSettings = (settings: ReminderSettings): ReminderSettings => ({
  ...settings,
  daysBeforePlan: settings.daysBeforePlan ?? 2,
  notifyOnPlanProposal: settings.notifyOnPlanProposal ?? true,
  notifyOnDateProposal: settings.notifyOnDateProposal ?? true,
  notifyOnPartnerAccepted: settings.notifyOnPartnerAccepted ?? true,
  notifyOnConfirmedPlan: settings.notifyOnConfirmedPlan ?? true,
});

export const RemindersPage = () => {
  const rawSettings = useAppStore((state) => state.reminderSettings);
  const settings = normalizeNotificationSettings(rawSettings);
  const coupleId = useAppStore((state) => state.coupleId);
  const updateReminderSettings = useAppStore((state) => state.updateReminderSettings);

  const { register, watch, setValue } = useForm<NotificationFormValues>({
    defaultValues: {
      enabled: settings.enabled,
      daysBeforePlan: settings.daysBeforePlan,
      notifyOnPlanProposal: settings.notifyOnPlanProposal,
      notifyOnDateProposal: settings.notifyOnDateProposal,
      notifyOnPartnerAccepted: settings.notifyOnPartnerAccepted,
      notifyOnConfirmedPlan: settings.notifyOnConfirmedPlan,
    },
    resolver: zodResolver(schema),
  });

  const enabled = watch('enabled');
  const daysBeforePlan = watch('daysBeforePlan');

  useEffect(() => {
    const subscription = watch((values) => {
      const result = schema.safeParse(values);
      if (!result.success) return;

      updateReminderSettings({
        ...settings,
        coupleId,
        enabled: result.data.enabled,
        daysBeforePlan: result.data.daysBeforePlan,
        notifyOnPlanProposal: result.data.notifyOnPlanProposal,
        notifyOnDateProposal: result.data.notifyOnDateProposal,
        notifyOnPartnerAccepted: result.data.notifyOnPartnerAccepted,
        notifyOnConfirmedPlan: result.data.notifyOnConfirmedPlan,
        updatedAt: new Date().toISOString(),
      });
    });

    return () => subscription.unsubscribe();
  }, [coupleId, settings, updateReminderSettings, watch]);

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        backTo="/profile"
        subtitle="Avisos utiles alrededor de propuestas, aceptaciones y planes acordados."
        title="Notificaciones"
      />

      <form className="space-y-4">
        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Qué queréis recibir</h2>
            <p className="mt-1 text-sm leading-6 text-mist">
              Elige qué eventos merecen una notificación. La activación general se controla desde Perfil.
            </p>
          </div>

          <ChoiceGroup
            disabled={!enabled}
            label="Aviso antes de un plan acordado"
            options={daysBeforeOptions}
            value={daysBeforePlan}
            onChange={(value) => setValue('daysBeforePlan', value, { shouldDirty: true, shouldValidate: true })}
          />

          <div className="space-y-3">
            <label className="flex items-start justify-between gap-4 rounded-[18px] border-2 border-ink/10 bg-eggshell px-4 py-3 text-sm font-semibold text-ink">
              <span>
                Propuestas de plan
                <span className="mt-1 block text-xs font-medium text-mist">
                  Cuando alguien propone un plan nuevo.
                </span>
              </span>
              <input
                className="control-checkbox"
                disabled={!enabled}
                type="checkbox"
                {...register('notifyOnPlanProposal')}
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-[18px] border-2 border-ink/10 bg-eggshell px-4 py-3 text-sm font-semibold text-ink">
              <span>
                Propuestas de fecha
                <span className="mt-1 block text-xs font-medium text-mist">
                  Cuando se añade o cambia una fecha.
                </span>
              </span>
              <input
                className="control-checkbox"
                disabled={!enabled}
                type="checkbox"
                {...register('notifyOnDateProposal')}
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-[18px] border-2 border-ink/10 bg-eggshell px-4 py-3 text-sm font-semibold text-ink">
              <span>
                Aceptaciones de tu pareja
                <span className="mt-1 block text-xs font-medium text-mist">
                  Cuando acepta vuestro plan o vuestra fecha.
                </span>
              </span>
              <input
                className="control-checkbox"
                disabled={!enabled}
                type="checkbox"
                {...register('notifyOnPartnerAccepted')}
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-[18px] border-2 border-ink/10 bg-eggshell px-4 py-3 text-sm font-semibold text-ink">
              <span>
                Plan cerrado
                <span className="mt-1 block text-xs font-medium text-mist">
                  Cuando plan y fecha quedan acordados.
                </span>
              </span>
              <input
                className="control-checkbox"
                disabled={!enabled}
                type="checkbox"
                {...register('notifyOnConfirmedPlan')}
              />
            </label>
          </div>
        </Card>
      </form>
    </div>
  );
};
