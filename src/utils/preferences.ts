import type { CouplePreferences } from '../types/plan';

const splitCoupleName = (coupleName: string) => {
  const [first, second] = coupleName.split(/\s+y\s+/i);
  return {
    partnerOneName: first?.trim() || 'Cris',
    partnerTwoName: second?.trim() || 'David',
  };
};

export const normalizePreferences = (preferences: CouplePreferences): CouplePreferences => {
  const names = splitCoupleName(preferences.coupleName);
  const partnerOneName = preferences.partnerOneName || names.partnerOneName;
  const partnerTwoName = preferences.partnerTwoName || names.partnerTwoName;

  return {
    ...preferences,
    partnerOneName,
    partnerTwoName,
    coupleName: `${partnerOneName} y ${partnerTwoName}`,
  };
};
