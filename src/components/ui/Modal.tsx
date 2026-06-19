import { createPortal } from 'react-dom';
import type { PropsWithChildren } from 'react';

export const Modal = ({
  open,
  children,
}: PropsWithChildren<{
  open: boolean;
}>) => {
  if (!open) return null;

  return createPortal(
    <div className="app-modal-overlay fixed inset-0 z-[120] flex min-h-dvh items-center justify-center bg-overlay/65 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-[390px]">{children}</div>
    </div>,
    document.body,
  );
};
