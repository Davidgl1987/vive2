import type { PropsWithChildren } from 'react';

export const Chip = ({
  children,
  active = false,
}: PropsWithChildren<{ active?: boolean }>) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
      active ? 'bg-blush text-surface' : 'bg-eggshell text-ink'
    }`}
  >
    {children}
  </span>
);
