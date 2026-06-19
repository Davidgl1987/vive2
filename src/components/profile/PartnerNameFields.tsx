import { ArrowUpDown } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { messages } from '../../i18n';

type PartnerNameFieldsProps = {
  partnerOneRegistration: UseFormRegisterReturn;
  partnerTwoRegistration: UseFormRegisterReturn;
  onSwap: () => void;
};

const NameField = ({
  colorClass,
  label,
  placeholder,
  registration,
}: {
  colorClass: string;
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
}) => (
  <label className="relative block">
    <span className="sr-only">{label}</span>
    <input className="field pr-14" placeholder={placeholder} {...registration} />
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute right-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full ring-4 ring-surface ${colorClass}`}
    />
  </label>
);

export const PartnerNameFields = ({
  partnerOneRegistration,
  partnerTwoRegistration,
  onSwap,
}: PartnerNameFieldsProps) => (
  <div className="space-y-2">
    <NameField
      colorClass="bg-blush"
      label={messages.common.placeholders.firstPerson}
      placeholder={messages.common.placeholders.alex}
      registration={partnerOneRegistration}
    />
    <div className="flex justify-center">
      <button
        aria-label={messages.pages.profile.preferences.swapAria}
        className="grid h-10 w-10 place-items-center rounded-full bg-eggshell text-ink shadow-[inset_0_0_0_1px_rgb(var(--color-text)/0.08)] transition hover:bg-primarySoft"
        type="button"
        onClick={onSwap}
      >
        <ArrowUpDown size={17} />
      </button>
    </div>
    <NameField
      colorClass="bg-lightBlue"
      label={messages.common.placeholders.secondPerson}
      placeholder={messages.common.placeholders.maria}
      registration={partnerTwoRegistration}
    />
  </div>
);
