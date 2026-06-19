export const ProgressBar = ({ value }: { value: number }) => {
  const safeValue = Math.min(100, Math.max(0, value));
  const visibleValue = safeValue > 0 ? Math.max(safeValue, 10) : 0;

  return (
    <div className="h-3 overflow-hidden rounded-full bg-surface shadow-[inset_0_1px_4px_rgb(var(--color-overlay)/0.08),0_1px_0_rgb(var(--color-surface)/0.85)]">
      <div
        className="h-full rounded-full bg-blush shadow-[0_4px_10px_rgb(var(--color-primary)/0.26)] transition-[width] duration-500"
        style={{ width: `${visibleValue}%` }}
      />
    </div>
  );
};
