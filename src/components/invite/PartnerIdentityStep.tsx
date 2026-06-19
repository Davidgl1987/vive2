import type { CouplePreferences, PartnerId } from '../../types/plan';
import { messages } from '../../i18n';
import { getPartnerChoiceLabel } from '../../utils/invite';

export const PartnerIdentityStep = ({
  description,
  preferences,
  onSelect,
  onBack,
}: {
  description: string;
  preferences: CouplePreferences;
  onSelect: (partnerId: PartnerId) => void;
  onBack: () => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mist">
          {messages.pages.joinByCode.whoAreYou}
        </p>
        <h2 className="mt-2 text-lg font-bold text-ink">
          {messages.pages.joinByCode.deviceUser}
        </h2>
        <p className="mt-1 text-sm leading-6 text-mist">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(['partner_one', 'partner_two'] as PartnerId[]).map((partnerId) => (
          <button
            key={partnerId}
            className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
              partnerId === 'partner_one'
                ? 'bg-blush text-surface shadow-soft hover:bg-blushDark'
                : 'bg-lightBlue text-surface shadow-[0_10px_22px_rgb(var(--color-accent-dark)/0.12)] hover:bg-accentDark'
            }`}
            type="button"
            onClick={() => onSelect(partnerId)}
          >
            {getPartnerChoiceLabel(partnerId, preferences)}
          </button>
        ))}
      </div>

      <button
        className="block w-full text-center text-sm font-semibold text-blush"
        type="button"
        onClick={onBack}
      >
        {messages.pages.joinByCode.changeCode}
      </button>
    </div>
  );
};
