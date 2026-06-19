import { CalendarDays, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CompletedPlan } from '../../types/memory';
import { formatLongDate } from '../../utils/format';
import { PhotoFallback } from '../ui/PhotoFallback';

export const MemoryCard = ({
  memory,
  planImage,
}: {
  memory: CompletedPlan;
  planImage?: string;
}) => {
  const partnerPhotos = Object.values(memory.partnerPhotos ?? {}).filter(Boolean) as string[];
  const displayPhotos =
    partnerPhotos.length > 0 ? partnerPhotos : [memory.photos[0] ?? planImage].filter(Boolean);

  return (
    <Link
      className="memory-card solid-card motion-card group block overflow-hidden rounded-[26px] transition duration-300 hover:-translate-y-1 hover:shadow-soft"
      to={`/memories/${memory.id}`}
    >
      {displayPhotos.length >= 2 ? (
        <div className="grid h-44 grid-cols-2 overflow-hidden">
          {displayPhotos.slice(0, 2).map((photo, index) => (
            <PhotoFallback
              key={`${memory.id}-${index}`}
              alt={memory.planTitle}
              className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
              src={photo}
            />
          ))}
        </div>
      ) : (
        <PhotoFallback
          alt={memory.planTitle}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          src={displayPhotos[0]}
        />
      )}
      <div className="space-y-3 bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-ink">{memory.planTitle}</h3>
            {memory.note ? <p className="text-sm text-mist">{memory.note}</p> : null}
          </div>
          <Heart className="fill-blush text-blush" size={18} />
        </div>
        <div className="space-y-2 text-sm text-mist">
          <p className="inline-flex items-center gap-2">
            <CalendarDays size={16} />
            {formatLongDate(memory.date)}
          </p>
          {memory.locationName ? (
            <p className="inline-flex items-center gap-2">
              <MapPin size={16} />
              {memory.locationName}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
};
