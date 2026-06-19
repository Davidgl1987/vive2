import { Camera, Trash2 } from 'lucide-react';
import { messages } from '../../i18n';

export const OwnPlanPhotoButton = ({
  embedded = false,
  hasPhoto,
  onRemovePhoto,
  onSelectPhoto,
}: {
  embedded?: boolean;
  hasPhoto: boolean;
  onRemovePhoto?: () => void;
  onSelectPhoto: (file: File) => void | Promise<void>;
}) => {
  const label = hasPhoto
    ? messages.components.ownPlanPhotoButton.change
    : messages.components.ownPlanPhotoButton.add;

  const showRemove = hasPhoto && Boolean(onRemovePhoto);

  return (
    <div
      className={`${showRemove ? 'grid grid-cols-2' : 'grid'} bg-surface ${
        embedded ? 'border-t border-ink/8' : 'overflow-hidden rounded-[20px] border border-ink/8 shadow-sm'
      }`}
    >
      <label className="flex cursor-pointer items-center justify-center gap-2 px-3 py-4 text-center text-sm font-extrabold text-blushDark transition hover:bg-primarySoft">
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
      {showRemove ? (
        <button
          className="flex items-center justify-center gap-2 border-l border-ink/8 px-3 py-4 text-sm font-extrabold text-mist transition hover:bg-eggshell hover:text-blushDark"
          type="button"
          onClick={onRemovePhoto}
        >
          <Trash2 size={17} />
          {messages.components.ownPlanPhotoButton.remove}
        </button>
      ) : null}
    </div>
  );
};
