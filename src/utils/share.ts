import type { CompletedPlan } from '../types/memory';

type ShareTarget = 'instagram' | 'whatsapp' | 'facebook' | 'more';

const openWindow = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const shareMemory = async (memory: CompletedPlan, target: ShareTarget) => {
  const text = `${memory.planTitle}\n${memory.note}`;

  if (navigator.share && target === 'more') {
    await navigator.share({
      title: memory.planTitle,
      text,
    });
    return 'shared';
  }

  if (target === 'whatsapp') {
    openWindow(`https://wa.me/?text=${encodeURIComponent(text)}`);
    return 'opened';
  }

  if (target === 'facebook') {
    openWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    );
    return 'opened';
  }

  if (target === 'instagram') {
    await navigator.clipboard.writeText(text);
    return 'copied-instagram';
  }

  await navigator.clipboard.writeText(text);
  return 'copied';
};
