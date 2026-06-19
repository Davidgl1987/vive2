import { Flame, Sprout, Trophy, type LucideIcon } from 'lucide-react';
import { challengeGoalOptions } from '../../config/challenge';
import { messages } from '../../i18n';
import type { ChallengeGoal } from '../../types/plan';

type ChallengeGoalSelectorProps = {
  value: ChallengeGoal;
  minimumGoal?: number;
  onChange: (goal: ChallengeGoal) => void;
};

const iconsByGoal: Record<ChallengeGoal, LucideIcon> = {
  10: Sprout,
  20: Flame,
  30: Trophy,
};

export const ChallengeGoalSelector = ({ value, minimumGoal = 0, onChange }: ChallengeGoalSelectorProps) => (
  <div className="space-y-3">
    <div>
      <p className="text-sm font-bold text-ink">{messages.challenge.title}</p>
      <p className="mt-1 text-sm leading-5 text-mist">{messages.challenge.description}</p>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {challengeGoalOptions.map((option) => {
        const active = option.value === value;
        const disabled = option.value < minimumGoal;
        const Icon = iconsByGoal[option.value];
        return (
          <button
            key={option.value}
            aria-pressed={active}
            disabled={disabled}
            className={`rounded-[18px] px-2 py-3 text-center transition ${
              active
                ? 'bg-blush text-surface shadow-soft'
                : disabled
                  ? 'cursor-not-allowed border-2 border-ink/5 bg-eggshell/55 text-mist/45'
                  : 'border-2 border-ink/10 bg-eggshell text-ink hover:border-primary/35 hover:bg-primarySoft'
            }`}
            type="button"
            onClick={() => onChange(option.value)}
          >
            <Icon className="mx-auto mb-2" size={19} />
            <span className="block text-sm font-extrabold">{option.label}</span>
            <span className={`mt-1 block text-xs font-semibold ${active ? 'text-surface/85' : 'text-mist'}`}>
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
    {minimumGoal > 10 ? (
      <p className="text-xs font-semibold leading-5 text-mist">
        {messages.challenge.minimumGoalHint}
      </p>
    ) : null}
  </div>
);
