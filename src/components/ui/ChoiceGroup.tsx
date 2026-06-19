export type ChoiceOption<T extends string | number> = {
  label: string;
  value: T;
};

export const ChoiceGroup = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label?: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}) => (
  <div>
    {label ? <span className="mb-2 block text-sm font-semibold text-ink">{label}</span> : null}
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
              active
                ? 'bg-blush text-surface shadow-soft'
                : 'border-2 border-ink/10 bg-eggshell text-ink hover:border-primary/35 hover:bg-primarySoft'
            } disabled:cursor-not-allowed disabled:opacity-45`}
            disabled={disabled}
            type="button"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);
