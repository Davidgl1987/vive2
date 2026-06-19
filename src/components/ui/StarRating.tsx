import { Star } from 'lucide-react';

export const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange?: (rating: 1 | 2 | 3 | 4 | 5) => void;
}) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4, 5].map((star) => {
      const filled = star <= value;
      return (
        <button
          key={star}
          className="transition hover:scale-110"
          type="button"
          onClick={() => onChange?.(star as 1 | 2 | 3 | 4 | 5)}
        >
          <Star
            className={filled ? 'fill-blush text-blush' : 'text-line'}
            size={20}
          />
        </button>
      );
    })}
  </div>
);
