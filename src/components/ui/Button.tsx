import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
  }
>;

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  fullWidth = true,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-blush text-surface shadow-soft hover:bg-blushDark',
    secondary: 'border-2 border-ink/10 bg-eggshell text-ink shadow-[0_8px_0_rgb(var(--color-overlay)/0.04)] hover:border-primary/35 hover:bg-primarySoft',
    ghost: 'bg-transparent text-blush hover:bg-primarySoft',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-body text-sm font-semibold transition ${
        variants[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
