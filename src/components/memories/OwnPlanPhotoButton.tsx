import { Camera } from 'lucide-react';
import { messages } from '../../i18n';

export const OwnPlanPhotoButton = ({
  embedded = false,
  hasPhoto,
  onSelectPhoto,
}: {
  embedded?: boolean;
  hasPhoto: boolean;
  onSelectPhoto: (file: File) => void | Promise<void>;
}) => {
  const label = hasPhoto
    ? messages.components.ownPlanPhotoButton.change
    : messages.components.ownPlanPhotoButton.add;

  return (
    <label
      className={`flex cursor-pointer items-center justify-center gap-2 bg-surface px-4 py-4 text-sm font-extrabold text-blushDark transition hover:bg-primarySoft ${
        embedded ? 'border-t border-ink/8' : 'rounded-[20px] border border-ink/8 shadow-sm'
      }`}
    >
      <Camera size={18} />
      {label}
      <input
        aria-label={label}
        accept="image/*"
        className="sr-only"
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onSelectPhoto(file);
          event.target.value = '';
        }}
      />
    </label>
  );
};
