import { Check } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

export const FeedbackModal = ({
  open,
  title,
  message,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) => {
  return (
    <Modal open={open}>
      <div className="solid-card rounded-[30px] p-5 shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-icyAqua text-accentDark">
          <Check size={22} />
        </div>
        <h2 className="mt-4 text-center font-heading text-2xl font-bold text-ink">{title}</h2>
        <p className="mt-2 text-center text-sm leading-6 text-mist">{message}</p>
        <Button className="mt-5" type="button" onClick={onClose}>
          Entendido
        </Button>
      </div>
    </Modal>
  );
};
