import type { CouplePreferences, PartnerId } from '../../types/plan';

const partners: PartnerId[] = ['partner_one', 'partner_two'];

const getPartnerName = (preferences: CouplePreferences, partnerId: PartnerId) =>
  partnerId === 'partner_one' ? preferences.partnerOneName : preferences.partnerTwoName;

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

const getAvatarClass = (partnerId: PartnerId, accepted: boolean) => {
  if (!accepted) return 'partner-avatar';
  return partnerId === 'partner_one' ? 'partner-avatar-one' : 'partner-avatar-two';
};

export const AcceptanceStatus = ({
  label,
  acceptedBy,
  preferences,
  compact = false,
}: {
  label: string;
  acceptedBy: PartnerId[];
  preferences: CouplePreferences;
  compact?: boolean;
}) => (
  <div
    className={
      compact
        ? 'flex min-h-[3rem] items-center justify-between gap-3 rounded-[18px] bg-gradient-to-br from-eggshell to-surface px-4 py-3 shadow-[inset_0_0_0_1px_rgb(var(--color-text)/0.07)]'
        : 'flex items-center justify-between gap-3 rounded-[18px] bg-eggshell px-4 py-3'
    }
  >
    <span className="block text-sm font-extrabold text-ink">{label}</span>
    <div
      className={
        compact
          ? 'flex items-center gap-1.5'
          : 'flex items-center gap-2'
      }
    >
      {partners.map((partnerId) => {
        const accepted = acceptedBy.includes(partnerId);
        const name = getPartnerName(preferences, partnerId);

        return (
          <div
            key={partnerId}
            className={`relative grid place-items-center rounded-full border-2 font-extrabold transition ${
              compact ? 'h-6 w-6 text-[0.68rem]' : 'h-9 w-9 text-sm'
            } border-surface ${getAvatarClass(partnerId, accepted)}`}
            title={`${name}${accepted ? ' ha aceptado' : ' pendiente'}`}
            aria-label={`${label}: ${name}${accepted ? ' ha aceptado' : ' pendiente'}`}
          >
            {getInitial(name)}
          </div>
        );
      })}
    </div>
  </div>
);
