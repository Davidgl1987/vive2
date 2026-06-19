import { ListChecks } from 'lucide-react';
import { messages } from '../../i18n';
import type { ChallengeGoal } from '../../types/plan';
import { ProgressBar } from '../ui/ProgressBar';

export const ChallengeProgress = ({
  completed,
  goal,
}: {
  completed: number;
  goal: ChallengeGoal;
}) => {
  const progress = Math.min(Math.round((completed / goal) * 100), 100);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-mist/70">
            <ListChecks size={16} />
            {messages.pages.home.progress}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-ink">
            {completed} / {goal}
          </h2>
          <p className="text-sm text-mist">{messages.pages.home.completedPlans}</p>
        </div>
        <div className="rounded-full bg-secondarySoft px-3 py-2 text-sm font-bold text-secondaryDark">
          {progress}%
        </div>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
};
