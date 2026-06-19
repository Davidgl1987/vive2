import { z } from 'zod';
import { messages } from '../../i18n';
import type { CouplePreferences } from '../../types/plan';

export const preferencesSchema = z.object({
  partnerOneName: z.string().min(2, messages.pages.preferences.errors.partnerOneName),
  partnerTwoName: z.string().min(2, messages.pages.preferences.errors.partnerTwoName),
});

export type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export const toCouplePreferences = (values: PreferencesFormValues): CouplePreferences => ({
  coupleName: `${values.partnerOneName} y ${values.partnerTwoName}`,
  partnerOneName: values.partnerOneName,
  partnerTwoName: values.partnerTwoName,
});
