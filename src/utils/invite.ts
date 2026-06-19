import type { CouplePreferences, PartnerId } from '../types/plan';
import { interpolate, messages } from '../i18n';

export type InvitePayload = {
  preferences: CouplePreferences;
};

const inviteCodePattern = /^VIVE2-[A-Z0-9]{6}$/;

const encodeBase64Url = (value: string) =>
  btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const decodeBase64Url = (value: string) => {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=');

  return decodeURIComponent(escape(atob(padded)));
};

export const buildInviteJoinUrl = (inviteCode: string, preferences: CouplePreferences) => {
  const url = new URL('/onboarding/join', window.location.origin);
  const payload: InvitePayload = { preferences };
  url.searchParams.set('code', inviteCode);
  url.searchParams.set('setup', encodeBase64Url(JSON.stringify(payload)));
  return url.toString();
};

export const parseInvitePayload = (rawPayload?: string | null): InvitePayload | undefined => {
  if (!rawPayload) return undefined;

  try {
    return JSON.parse(decodeBase64Url(rawPayload)) as InvitePayload;
  } catch {
    return undefined;
  }
};

export const normalizeInviteCode = (rawCode: string) => rawCode.trim().toUpperCase();

export const validateInviteCodeInput = (rawCode: string, ownInviteCode?: string) => {
  const normalizedCode = normalizeInviteCode(rawCode);

  if (!normalizedCode) {
    return {
      ok: false as const,
      message: messages.invite.errors.emptyCode,
    };
  }

  if (!inviteCodePattern.test(normalizedCode)) {
    return {
      ok: false as const,
      message: messages.invite.errors.invalidFormat,
    };
  }

  if (ownInviteCode && normalizedCode === ownInviteCode) {
    return {
      ok: false as const,
      message: messages.invite.errors.ownCode,
    };
  }

  return {
    ok: true as const,
    normalizedCode,
  };
};

export const getPartnerChoiceLabel = (
  partnerId: PartnerId,
  preferences?: CouplePreferences,
) => {
  if (!preferences) {
    return partnerId === 'partner_one' ? messages.invite.choice.first : messages.invite.choice.second;
  }

  return interpolate(messages.invite.choice.named, {
    name: partnerId === 'partner_one' ? preferences.partnerOneName : preferences.partnerTwoName,
  });
};
