import { ImageIcon } from 'lucide-react';

export const PhotoFallback = ({
  alt,
  src,
  className = '',
  iconSize = 28,
}: {
  alt: string;
  src?: string | null;
  className?: string;
  iconSize?: number;
}) => {
  if (src) {
    return <img alt={alt} className={className} src={src} />;
  }

  return (
    <div
      aria-label={alt}
      className={`flex items-center justify-center bg-gradient-to-br from-primarySoft via-eggshell to-icyAqua text-accentDark ${className}`}
      role="img"
    >
      <div className="grid place-items-center gap-2 text-center">
        <ImageIcon size={iconSize} />
        <span className="text-xs font-extrabold uppercase tracking-[0.18em]">Sin foto</span>
      </div>
    </div>
  );
};
