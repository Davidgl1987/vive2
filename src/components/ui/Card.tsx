import type { HTMLAttributes, PropsWithChildren } from 'react';

export const Card = ({
  children,
  className = '',
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={`solid-card motion-card rounded-[24px] p-5 ${className}`}
    {...props}
  >
    {children}
  </div>
);
