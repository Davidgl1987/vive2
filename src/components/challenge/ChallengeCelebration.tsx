import { BookHeart, Sparkles, Trophy } from 'lucide-react';
import { interpolate, messages } from '../../i18n';
import type { CompletedChallenge } from '../../types/challenge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const ChallengeCelebration = ({
  challenge,
  onCreateBook,
  onContinue,
}: {
  challenge?: CompletedChallenge;
  onCreateBook: () => void;
  onContinue: () => void;
}) => (
  <Modal open={Boolean(challenge)}>
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-eggshell via-surface to-secondarySoft p-6 text-center shadow-soft">
      <Sparkles className="absolute left-6 top-7 text-blush/55" size={22} />
      <Sparkles className="absolute right-7 top-16 text-accentDark/55" size={17} />
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush text-surface shadow-soft">
        <Trophy size={34} />
      </div>
      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.22em] text-blushDark">
        {messages.challenge.celebration.eyebrow}
      </p>
      <h2 className="mt-2 font-heading text-3xl font-bold leading-none text-ink">
        {messages.challenge.celebration.title}
      </h2>
      <p className="mx-auto mt-3 max-w-[30ch] text-sm leading-6 text-mist">
        {interpolate(messages.challenge.celebration.description, {
          count: challenge?.goal ?? 0,
        })}
      </p>
      <div className="mt-6 space-y-3">
        <Button type="button" onClick={onCreateBook}>
          <BookHeart className="mr-2" size={17} />
          {messages.challenge.celebration.createBook}
        </Button>
        <Button type="button" variant="secondary" onClick={onContinue}>
          {messages.challenge.celebration.continue}
        </Button>
      </div>
    </div>
  </Modal>
);
