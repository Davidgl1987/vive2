import type { CompletedPlan } from '../types/memory';

export const getPartnerPhotos = (memory: CompletedPlan) =>
  Object.values(memory.partnerPhotos ?? {}).filter(Boolean) as string[];

export const resolveMemoryPhotos = (memory: CompletedPlan, planImage?: string) => {
  const partnerPhotos = getPartnerPhotos(memory);
  if (memory.partnerPhotos !== undefined) {
    return partnerPhotos.length > 0 ? partnerPhotos : [planImage].filter(Boolean) as string[];
  }
  if (memory.photos.length > 0) return memory.photos;
  return [planImage].filter(Boolean) as string[];
};

