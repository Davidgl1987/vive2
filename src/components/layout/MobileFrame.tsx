import type { PropsWithChildren } from 'react';

export const MobileFrame = ({
  children,
  withNav = false,
}: PropsWithChildren<{ withNav?: boolean }>) => (
  <div
    className={`mobile-frame mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pt-7 sm:my-6 sm:min-h-[860px] sm:rounded-[36px] sm:border sm:border-surface/80 sm:shadow-soft ${
      withNav ? 'pb-[calc(7.75rem+env(safe-area-inset-bottom))]' : 'pb-6'
    }`}
  >
    <div className="flex-1">{children}</div>
  </div>
);
