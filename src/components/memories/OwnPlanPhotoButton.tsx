import { Camera, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { mediaPolicy } from '../../config/media';
import { messages } from '../../i18n';
import { validateImageFile } from '../../utils/imageFiles';

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
  const [error, setError] = useState<string>();
  const label = hasPhoto
    ? messages.components.ownPlanPhotoButton.change
    : messages.components.ownPlanPhotoButton.add;

  const showRemove = hasPhoto && Boolean(onRemovePhoto);

  return (
    <div>
      <div
        className={`${showRemove ? 'grid grid-cols-2' : 'grid'} bg-surface ${embedded
          ? 'border-t border-ink/8'
          : 'overflow-hidden rounded-[20px] border border-ink/8 shadow-sm'
          }`}
      >
        <label className="flex cursor-pointer items-center justify-center gap-2 px-3 py-4 text-center text-sm font-extrabold text-blushDark transition hover:bg-primarySoft">
          <Camera size={18} />
          {label}
          <input
            aria-label={label}
            accept={mediaPolicy.acceptedMimeTypes.join(',')}
            className="sr-only"
            type="file"
            onClick={() => setError(undefined)}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) {
                const validation = await validateImageFile(file);
                if (validation.ok) {
                  setError(undefined);
                  void onSelectPhoto(file);
                } else {
                  setError(validation.message);
                }
              }
              event.target.value = '';
            }}
          />
        </label>
        {showRemove ? (
          <button
            className="flex items-center justify-center gap-2 border-l border-ink/8 px-3 py-4 text-sm font-extrabold text-mist transition hover:bg-eggshell hover:text-blushDark"
            type="button"
            onClick={() => {
              setError(undefined);
              onRemovePhoto?.();
            }}
          >
            <Trash2 size={17} />
            {messages.components.ownPlanPhotoButton.remove}
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="pt-2 pb-2 bg-red-100 text-sm text-center font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
